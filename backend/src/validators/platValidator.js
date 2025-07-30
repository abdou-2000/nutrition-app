import Joi from 'joi';

export const platSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().optional(),
  benefits: Joi.string().optional(),
  is_global: Joi.boolean().optional(),
  programme_id: Joi.number().optional(),
});

export const platUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  image: Joi.string(),
  benefits: Joi.string(),
  is_global: Joi.boolean(),
  programme_id: Joi.number(),
});
