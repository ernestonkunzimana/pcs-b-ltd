import Joi from 'joi';

export const paymentValidation = {
  create: Joi.object({
    paymentDate: Joi.date().required(),
    paymentType: Joi.string().valid('received', 'sent').required(),
    paymentMethodId: Joi.string().uuid().optional(),
    referenceType: Joi.string().valid('invoice', 'loan', 'expense', 'salary').optional(),
    referenceId: Joi.string().uuid().optional(),
    payerId: Joi.string().uuid().optional(),
    payerType: Joi.string().valid('customer', 'supplier', 'employee').optional(),
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).optional(),
    exchangeRate: Joi.number().positive().optional(),
    transactionFee: Joi.number().min(0).optional(),
    externalTransactionId: Joi.string().optional(),
    notes: Joi.string().optional(),
  }),

  update: Joi.object({
    paymentDate: Joi.date().optional(),
    paymentType: Joi.string().valid('received', 'sent').optional(),
    paymentMethodId: Joi.string().uuid().optional(),
    referenceType: Joi.string().valid('invoice', 'loan', 'expense', 'salary').optional(),
    referenceId: Joi.string().uuid().optional(),
    payerId: Joi.string().uuid().optional(),
    payerType: Joi.string().valid('customer', 'supplier', 'employee').optional(),
    amount: Joi.number().positive().optional(),
    currency: Joi.string().length(3).optional(),
    exchangeRate: Joi.number().positive().optional(),
    transactionFee: Joi.number().min(0).optional(),
    status: Joi.string().valid('pending', 'completed', 'failed', 'cancelled').optional(),
    externalTransactionId: Joi.string().optional(),
    notes: Joi.string().optional(),
  }),
};