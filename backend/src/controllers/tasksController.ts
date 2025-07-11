import { Request, Response } from 'express';
import pool from '../db/db';

// Get all tasks from DB
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY due_date ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve tasks', error });
  }
};

// Create a new task in DB
export const createTask = async (req: Request, res: Response) => {
  const { project_id, title, description, assigned_to, due_date } = req.body;

  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO tasks (project_id, title, description, assigned_to, due_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project_id, title, description, assigned_to, due_date]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error });
  }
};

// Get task by ID from DB
export const getTaskById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Task not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get task', error });
  }
};

// Update task in DB
export const updateTask = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description, completed, due_date, assigned_to } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE tasks 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           completed = COALESCE($3, completed),
           due_date = COALESCE($4, due_date),
           assigned_to = COALESCE($5, assigned_to)
       WHERE id = $6
       RETURNING *`,
      [title, description, completed, due_date, assigned_to, id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Task not found' });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error });
  }
};

// Delete task from DB
export const deleteTask = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ message: 'Task not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error });
  }
};
