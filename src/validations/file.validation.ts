import Joi from 'joi';

const uploadFile = {
  body: Joi.object().keys({
    folderId: Joi.number().integer().required()
  })
};

const deleteFile = {
  params: Joi.object().keys({
    fileId: Joi.number().integer().required()
  })
};

const renameFile = {
  params: Joi.object().keys({
    fileId: Joi.number().integer().required()
  }),
  body: Joi.object().keys({
    newName: Joi.string().required()
  })
};

const moveFile = {
  params: Joi.object().keys({
    fileId: Joi.number().integer().required(),
    destinationId: Joi.number().integer().required()
  })
};

export default {
  uploadFile,
  deleteFile,
  renameFile,
  moveFile
};
