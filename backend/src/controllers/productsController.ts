import { Request, Response } from 'express';
import pool from '../db/db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
