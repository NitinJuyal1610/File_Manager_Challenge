import {
  CreateBucketCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';

import path from 'path';
import config from '../config/config';
import logger from '../config/logger';
import { createReadStream } from 'fs';
import { Upload } from '@aws-sdk/lib-storage';

const client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  }
});

export const createBucket = async () => {
  const command = new CreateBucketCommand({
    Bucket: config.aws.bucketName,
    CreateBucketConfiguration: {
      LocationConstraint: config.aws.region
    }
  });

  try {
    await client.send(command);
    logger.info(`Successfully created a bucket called "${config.aws.bucketName}"`);
  } catch (err: any) {
    if (err.Code === 'BucketAlreadyOwnedByYou') {
      logger.info(`Bucket with this name "${config.aws.bucketName}" already exist`);
    } else if (err.Code === 'BucketAlreadyExists') {
      logger.info(`Bucket with this name "${config.aws.bucketName}" already exist`);
    } else if (err['$metadata'].httpStatusCode === 403) {
      return logger.error(err.Code);
    }
  }
};

export const createEmptyObject = async (key: string) => {
  const command = new PutObjectCommand({
    Bucket: config.aws.bucketName,
    Key: key
  });

  try {
    await client.send(command);
    return true;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const uploadFile = async function (targetPath: string, fileName: string, filePath: string) {
  try {
    const parallelUploads3 = new Upload({
      client,
      params: {
        Bucket: config.aws.bucketName,
        Key: targetPath,
        Body: createReadStream(filePath)
      }
    });
    await parallelUploads3.done();
    return true;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

export const deleteObject = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: config.aws.bucketName,
    Key: key
  });

  try {
    await client.send(command);
    return true;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

export const moveObject = async (key: string, newLocation: string) => {
  const command = new CopyObjectCommand({
    Bucket: config.aws.bucketName,
    CopySource: `${config.aws.bucketName}/${key}`,
    Key: newLocation
  });

  try {
    await client.send(command);
    await deleteObject(key);
    return true;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
