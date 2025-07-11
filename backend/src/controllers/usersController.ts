import { Request, Response } from 'express';
import pool from '../db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Register new user
export const registerUser = async (req: Request, res: Response) => {
  const { email, password, first_name, last_name } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, first_name, last_name`,
      [email, hashedPassword, first_name, last_name]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to register user', error });
  }
};

// User login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT id, email, first_name, last_name FROM users ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users', error });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { rows } = await pool.query('SELECT id, email, first_name, last_name FROM users WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user', error });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { email, first_name, last_name } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET email = COALESCE($1, email),
           first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name)
       WHERE id = $4
       RETURNING id, email, first_name, last_name`,
      [email, first_name, last_name, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error });
  }
};
