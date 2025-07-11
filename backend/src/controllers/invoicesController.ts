import { Request, Response } from 'express';
import pool from '../db/db';

// Get all invoices
export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM invoices ORDER BY invoice_date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve invoices', error });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Invoice not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve invoice', error });
  }
};

// Create a new invoice
export const createInvoice = async (req: Request, res: Response) => {
  const { customer_id, project_id, invoice_number, invoice_date, due_date, total_amount } = req.body;
  if (!customer_id || !invoice_number || !invoice_date || !due_date || !total_amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO invoices (customer_id, project_id, invoice_number, invoice_date, due_date, total_amount)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [customer_id, project_id, invoice_number, invoice_date, due_date, total_amount]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create invoice', error });
  }
};

// Update an invoice
export const updateInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { customer_id, project_id, invoice_number, invoice_date, due_date, total_amount } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE invoices
       SET customer_id = COALESCE($1, customer_id),
           project_id = COALESCE($2, project_id),
           invoice_number = COALESCE($3, invoice_number),
           invoice_date = COALESCE($4, invoice_date),
           due_date = COALESCE($5, due_date),
           total_amount = COALESCE($6, total_amount)
       WHERE id = $7
       RETURNING *`,
      [customer_id, project_id, invoice_number, invoice_date, due_date, total_amount, id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Invoice not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update invoice', error });
  }
};

// Delete an invoice
export const deleteInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM invoices WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Invoice not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete invoice', error });
  }
};
