import Joi from 'joi';

export const programmeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  objective: Joi.string().required(),
  image: Joi.string().optional(),
});
