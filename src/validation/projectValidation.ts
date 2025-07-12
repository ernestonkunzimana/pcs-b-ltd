import Joi from 'joi';

export const projectValidation = {
  create: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().optional(),
    projectType: Joi.string().optional(),
    status: Joi.string().valid('planning', 'active', 'on_hold', 'completed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    estimatedBudget: Joi.number().positive().optional(),
    clientId: Joi.string().uuid().optional(),
    projectManagerId: Joi.string().uuid().optional(),
    location: Joi.string().optional(),
    coordinates: Joi.string().optional(),
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    description: Joi.string().optional(),
    projectType: Joi.string().optional(),
    status: Joi.string().valid('planning', 'active', 'on_hold', 'completed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    estimatedBudget: Joi.number().positive().optional(),
    actualCost: Joi.number().min(0).optional(),
    progressPercentage: Joi.number().min(0).max(100).optional(),
    clientId: Joi.string().uuid().optional(),
    projectManagerId: Joi.string().uuid().optional(),
    location: Joi.string().optional(),
    coordinates: Joi.string().optional(),
  }),
};