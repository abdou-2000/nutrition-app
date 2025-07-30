import Joi from 'joi';

export const commentSchema = Joi.object({
  type: Joi.string().valid('programme', 'plat', 'conseil').required(),
  target_id: Joi.number().required(),
  content: Joi.string().required(),
});
