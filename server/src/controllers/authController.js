import bcrypt from 'bcryptjs';
import { query, queryOne } from '../config/db.js';
import { generateToken } from '../utils/generateToken.js';

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const existingUser = await queryOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = ['USER', 'GUIDE', 'ADMIN'].includes(role) ? role : 'USER';
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const result = await query(
      'INSERT INTO users (name, email, phone, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), phone || '', hashedPassword, assignedRole, avatar]
    );

    const userId = result.insertId;

    // If registered as GUIDE, create default guide profile entry
    if (assignedRole === 'GUIDE') {
      await query(
        `INSERT INTO guides (user_id, location, experience_years, languages, specializations, hourly_rate, rating, reviews_count) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, 'Manali, India', 1, JSON.stringify(['English', 'Hindi']), JSON.stringify(['Trekking', 'Camping']), 25.00, 5.00, 0]
      );
    }

    const newUser = await queryOne('SELECT id, name, email, phone, role, avatar, bio FROM users WHERE id = ?', [userId]);
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: newUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await queryOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio
    };

    const token = generateToken(safeUser);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    let guideInfo = null;

    if (req.user.role === 'GUIDE') {
      guideInfo = await queryOne('SELECT * FROM guides WHERE user_id = ?', [req.user.id]);
    }

    res.json({
      success: true,
      data: {
        user: req.user,
        guideProfile: guideInfo
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, phone, bio, avatar } = req.body;

    await query(
      'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), bio = COALESCE(?, bio), avatar = COALESCE(?, avatar) WHERE id = ?',
      [name, phone, bio, avatar, req.user.id]
    );

    const updatedUser = await queryOne('SELECT id, name, email, phone, role, avatar, bio FROM users WHERE id = ?', [req.user.id]);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
}
