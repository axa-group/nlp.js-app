import { decimal } from '../../../constants';

export const settings = {
  secret: process.env.JWT_SECRET_KEY,
  saltRounds: process.env.SALT_FACTOR_INT ? parseInt(process.env.SALT_FACTOR_INT, decimal) : 100,
  expiresIn: process.env.EXPIRY_TIME_SECONDS ? parseInt(process.env.EXPIRY_TIME_SECONDS, decimal) : 3600,
  refreshExpiresIn: process.env.REFRESH_EXPIRY_TIME_SECONDS
    ? parseInt(process.env.REFRESH_EXPIRY_TIME_SECONDS, decimal)
    : 10800,
  refreshTokenLength: 256,
  userJwtPayloadFields: ['username', 'role']
};
