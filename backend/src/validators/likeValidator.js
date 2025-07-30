import Joi from 'joi';

export const likeSchema = Joi.object({
  type: Joi.string().valid('programme', 'plat', 'conseil').required(),
  target_id: Joi.number().required(),
});
