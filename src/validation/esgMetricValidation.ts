import Joi from 'joi';

export const esgMetricValidation = {
  create: Joi.object({
    metricType: Joi.string().valid('environmental', 'social', 'governance').required(),
    metricName: Joi.string().min(1).max(100).required(),
    metricValue: Joi.number().required(),
    unitOfMeasure: Joi.string().optional(),
    measurementDate: Joi.date().required(),
    projectId: Joi.string().uuid().optional(),
    notes: Joi.string().optional(),
  }),

  update: Joi.object({
    metricType: Joi.string().valid('environmental', 'social', 'governance').optional(),
    metricName: Joi.string().min(1).max(100).optional(),
    metricValue: Joi.number().optional(),
    unitOfMeasure: Joi.string().optional(),
    measurementDate: Joi.date().optional(),
    projectId: Joi.string().uuid().optional(),
    notes: Joi.string().optional(),
  }),
};