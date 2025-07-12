import Joi from 'joi';

export const transactionValidation = {
  create: Joi.object({
    transactionDate: Joi.date().required(),
    transactionType: Joi.string().valid('income', 'expense', 'transfer', 'adjustment').required(),
    referenceType: Joi.string().optional(),
    referenceId: Joi.string().uuid().optional(),
    description: Joi.string().optional(),
    totalAmount: Joi.number().positive().required(),
    entries: Joi.array().items(
      Joi.object({
        accountId: Joi.string().uuid().required(),
        debitAmount: Joi.number().min(0).optional(),
        creditAmount: Joi.number().min(0).optional(),
        description: Joi.string().optional(),
      })
    ).min(2).required(),
  }),

  update: Joi.object({
    transactionDate: Joi.date().optional(),
    transactionType: Joi.string().valid('income', 'expense', 'transfer', 'adjustment').optional(),
    referenceType: Joi.string().optional(),
    referenceId: Joi.string().uuid().optional(),
    description: Joi.string().optional(),
    totalAmount: Joi.number().positive().optional(),
    status: Joi.string().valid('pending', 'approved', 'rejected').optional(),
    entries: Joi.array().items(
      Joi.object({
        accountId: Joi.string().uuid().required(),
        debitAmount: Joi.number().min(0).optional(),
        creditAmount: Joi.number().min(0).optional(),
        description: Joi.string().optional(),
      })
    ).min(2).optional(),
  }),
};