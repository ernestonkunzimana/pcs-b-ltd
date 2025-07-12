import Joi from 'joi';

export const invoiceValidation = {
  create: Joi.object({
    customerId: Joi.string().uuid().required(),
    projectId: Joi.string().uuid().optional(),
    invoiceDate: Joi.date().required(),
    dueDate: Joi.date().required(),
    taxAmount: Joi.number().min(0).optional(),
    discountAmount: Joi.number().min(0).optional(),
    notes: Joi.string().optional(),
    termsConditions: Joi.string().optional(),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().uuid().optional(),
        description: Joi.string().required(),
        quantity: Joi.number().positive().required(),
        unitPrice: Joi.number().positive().required(),
        totalPrice: Joi.number().positive().required(),
      })
    ).min(1).required(),
  }),

  update: Joi.object({
    customerId: Joi.string().uuid().optional(),
    projectId: Joi.string().uuid().optional(),
    invoiceDate: Joi.date().optional(),
    dueDate: Joi.date().optional(),
    status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled').optional(),
    taxAmount: Joi.number().min(0).optional(),
    discountAmount: Joi.number().min(0).optional(),
    notes: Joi.string().optional(),
    termsConditions: Joi.string().optional(),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().uuid().optional(),
        description: Joi.string().required(),
        quantity: Joi.number().positive().required(),
        unitPrice: Joi.number().positive().required(),
        totalPrice: Joi.number().positive().required(),
      })
    ).min(1).optional(),
  }),
};