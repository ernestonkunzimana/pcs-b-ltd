import { Request, Response } from 'express';
import pool from '../db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, first_name, last_name } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name)
    VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name`,
    [email, password_hash, first_name, last_name]
  );
  res.status(201).json(rows[0]);
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) return res.status(400).json({ message: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1d' });
  res.json({ token });
};
