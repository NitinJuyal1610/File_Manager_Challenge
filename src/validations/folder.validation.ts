import Joi from 'joi';

const createFolder = {
  params: Joi.object().keys({
    parentId: Joi.number().integer().optional()
  }),
  body: Joi.object().keys({
    name: Joi.string()
      .regex(/^[^/]*$/)
      .max(1024)
      .required()
  })
};

export default {
  createFolder
};
