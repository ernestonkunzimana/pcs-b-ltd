import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../config/logger';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { error } = schema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message,
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('Validation error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

export const validateQueryParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { error } = schema.validate(req.query);
      
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Query validation error',
          error: error.details[0].message,
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('Query validation error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};