import Joi from 'joi';

export const conseilSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  is_global: Joi.boolean().optional(),
  programme_id: Joi.number().optional(),
});

export const conseilUpdateSchema = Joi.object({
  title: Joi.string(),
  content: Joi.string(),
  is_global: Joi.boolean(),
  programme_id: Joi.number(),
});
