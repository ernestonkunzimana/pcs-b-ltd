import Joi from 'joi';

export const taskValidation = {
  create: Joi.object({
    projectId: Joi.string().uuid().required(),
    parentTaskId: Joi.string().uuid().optional(),
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().optional(),
    taskType: Joi.string().optional(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    assignedTo: Joi.string().uuid().optional(),
    estimatedHours: Joi.number().positive().optional(),
    dueDate: Joi.date().optional(),
    location: Joi.string().optional(),
    coordinates: Joi.string().optional(),
  }),

  update: Joi.object({
    parentTaskId: Joi.string().uuid().optional(),
    title: Joi.string().min(1).max(255).optional(),
    description: Joi.string().optional(),
    taskType: Joi.string().optional(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    assignedTo: Joi.string().uuid().optional(),
    estimatedHours: Joi.number().positive().optional(),
    actualHours: Joi.number().min(0).optional(),
    dueDate: Joi.date().optional(),
    startedAt: Joi.date().optional(),
    completedAt: Joi.date().optional(),
    location: Joi.string().optional(),
    coordinates: Joi.string().optional(),
  }),
};