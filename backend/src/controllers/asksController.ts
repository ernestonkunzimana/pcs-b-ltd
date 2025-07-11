import { Request, Response } from 'express';
import pool from '../db/db';

export const getTasks = async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM tasks ORDER BY due_date ASC');
  res.json(rows);
};

export const createTask = async (req: Request, res: Response) => {
  const { project_id, title, description, assigned_to, due_date } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO tasks (project_id, title, description, assigned_to, due_date)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [project_id, title, description, assigned_to, due_date]
  );
  res.status(201).json(rows[0]);
};
