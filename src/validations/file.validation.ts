import Joi from 'joi';

const uploadFile = {
  body: Joi.object().keys({
    folderId: Joi.number().integer().required()
  })
};

export default {
  uploadFile
};
