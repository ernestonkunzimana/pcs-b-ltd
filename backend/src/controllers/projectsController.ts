import { Request, Response } from 'express';
import pool from '../db/db';

// GET all projects
export const getProjects = async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
  res.json(rows);
};

// GET project by id
export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
  res.json(rows[0]);
};

// CREATE new project
export const createProject = async (req: Request, res: Response) => {
  const { name, organization_id, description, status } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO projects (name, organization_id, description, status) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, organization_id, description, status]
  );
  res.status(201).json(rows[0]);
};

// UPDATE a project
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, status } = req.body;
  const { rows } = await pool.query(
    `UPDATE projects SET name = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
    [name, description, status, id]
  );
  res.json(rows[0]);
};

// DELETE a project
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM projects WHERE id = $1', [id]);
  res.status(204).send();
};
