import Joi from 'joi';

export const inventoryValidation = {
  create: Joi.object({
    productId: Joi.string().uuid().required(),
    location: Joi.string().optional(),
    quantityAvailable: Joi.number().min(0).required(),
    quantityReserved: Joi.number().min(0).optional(),
    quantityOrdered: Joi.number().min(0).optional(),
    lastRestockedAt: Joi.date().optional(),
  }),

  update: Joi.object({
    productId: Joi.string().uuid().optional(),
    location: Joi.string().optional(),
    quantityAvailable: Joi.number().min(0).optional(),
    quantityReserved: Joi.number().min(0).optional(),
    quantityOrdered: Joi.number().min(0).optional(),
    lastRestockedAt: Joi.date().optional(),
  }),
};