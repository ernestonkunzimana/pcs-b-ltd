import { Request, Response } from 'express';
import pool from '../db/db';

export const getInvoices = async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM invoices ORDER BY invoice_date DESC');
  res.json(rows);
};

export const getInvoiceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);
  res.json(rows[0]);
};

export const createInvoice = async (req: Request, res: Response) => {
  const { customer_id, project_id, invoice_number, invoice_date, due_date, total_amount } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO invoices (customer_id, project_id, invoice_number, invoice_date, due_date, total_amount)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [customer_id, project_id, invoice_number, invoice_date, due_date, total_amount]
  );
  res.status(201).json(rows[0]);
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM invoices WHERE id = $1', [id]);
  res.status(204).send();
};
