import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}
