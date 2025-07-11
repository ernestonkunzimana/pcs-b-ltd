import { Request, Response } from 'express';
import pool from '../db/db';

// Get all payments
export const getPayments = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM payments');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Payment not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

// Create a new payment
export const createPayment = async (req: Request, res: Response) => {
  const { payment_number, amount, payment_date, payment_type, organization_id } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO payments (payment_number, amount, payment_date, payment_type, organization_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [payment_number, amount, payment_date, payment_type, organization_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
};
