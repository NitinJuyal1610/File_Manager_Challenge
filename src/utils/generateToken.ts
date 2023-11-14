import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../config/config';

export const generateToken = (userId: number, secret = config.jwt.secret): string => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: accessTokenExpires.unix()
  };
  return jwt.sign(payload, secret);
};
