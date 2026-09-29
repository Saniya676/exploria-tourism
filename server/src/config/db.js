import mysql from 'mysql2/promise';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mysqlPool = null;
let sqliteDb = null;
let dbMode = 'UNKNOWN';

export async function initDatabase() {
  // 1. Try MySQL Connection
  try {
    const tempPool = mysql.createPool({
      host: config.db.host,
      port: Number(config.db.port),
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const conn = await tempPool.getConnection();
    await conn.ping();
    conn.release();
    mysqlPool = tempPool;
    dbMode = 'MYSQL';
    console.log(`[Database] Connected to MySQL database (${config.db.database} @ ${config.db.host})`);
    return dbMode;
  } catch (err) {
    console.log(`[Database] MySQL not reachable (${err.message}). Falling back to SQLite local database.`);
  }

  // 2. Fallback to SQLite
  try {
    const dbDir = path.resolve(__dirname, '../../../database');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = path.join(dbDir, 'exploria_local.db');
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('foreign_keys = ON');

    // Run schema and seed if SQLite tables don't exist
    dbMode = 'SQLITE';
    const userTableCheck = sqliteDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (!userTableCheck) {
      console.log('[Database] Initializing SQLite schema and seed data...');
      runSqliteSchemaAndSeed(dbPath, sqliteDb, dbDir);
      const { populateSeedData } = await import('../models/seedData.js');
      await populateSeedData();
    }

    dbMode = 'SQLITE';
    console.log(`[Database] Connected to SQLite local database (${dbPath})`);
    return dbMode;
  } catch (sqliteErr) {
    console.error('[Database] Failed to initialize SQLite database:', sqliteErr);
    throw sqliteErr;
  }
}

function runSqliteSchemaAndSeed(dbPath, db, dbDir) {
  const schemaPath = path.join(dbDir, 'schema.sql');
  const seedPath = path.join(dbDir, 'seed.sql');

  if (fs.existsSync(schemaPath)) {
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');
    // Adapt MySQL syntax for SQLite
    schemaSql = schemaSql
      .replace(/CREATE DATABASE IF NOT EXISTS.*;/g, '')
      .replace(/USE .*/g, '')
      .replace(/ENGINE=.*?;/g, ';')
      .replace(/INT AUTO_INCREMENT PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/AUTO_INCREMENT/gi, '')
      .replace(/ENUM\([^)]+\)/gi, 'TEXT')
      .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
      .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
      .replace(/UNIQUE KEY \w+ \(([^)]+)\)/gi, 'UNIQUE ($1)')
      .replace(/BOOLEAN/gi, 'INTEGER');

    db.exec(schemaSql);
  }

  if (fs.existsSync(seedPath)) {
    let seedSql = fs.readFileSync(seedPath, 'utf8');
    seedSql = seedSql
      .replace(/USE .*/g, '')
      .replace(/SET FOREIGN_KEY_CHECKS = \d;/g, '')
      .replace(/TRUNCATE TABLE/gi, 'DELETE FROM');

    // Split statements and execute individually
    const statements = seedSql.split(';').map(s => s.trim()).filter(Boolean);
    db.transaction(() => {
      for (const stmt of statements) {
        try {
          db.prepare(stmt).run();
        } catch (e) {
          // ignore minor duplicate or table format warnings on initial bulk seed
        }
      }
    })();
  }
}

export async function query(sql, params = []) {
  if (!dbMode || dbMode === 'UNKNOWN') {
    await initDatabase();
  }

  if (dbMode === 'MYSQL') {
    const [rows] = await mysqlPool.execute(sql, params);
    return rows;
  } else {
    // SQLite execution wrapper
    const trimmedSql = sql.trim();
    const isSelect = /^SELECT/i.test(trimmedSql);
    
    // Replace MySQL specific syntax if any
    let adaptSql = sql;

    if (isSelect) {
      const stmt = sqliteDb.prepare(adaptSql);
      return stmt.all(...params);
    } else {
      const stmt = sqliteDb.prepare(adaptSql);
      const info = stmt.run(...params);
      return {
        insertId: Number(info.lastInsertRowid),
        affectedRows: info.changes
      };
    }
  }
}

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows && rows.length > 0 ? rows[0] : null;
}

export function getDbMode() {
  return dbMode;
}
