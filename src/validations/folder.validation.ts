import Joi from 'joi';

const createFolder = {
  body: Joi.object().keys({
    name: Joi.string()
      .regex(/^[^/]*$/)
      .max(1024)
      .required()
  })
};

const createSubFolder = {
  params: Joi.object().keys({
    parentId: Joi.number().integer()
  }),
  body: Joi.object().keys({
    name: Joi.string()
      .regex(/^[^/]*$/)
      .max(1024)
      .required()
  })
};

export default {
  createFolder,
  createSubFolder
};
