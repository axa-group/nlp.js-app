import { decimal } from '../../../constants';

export const settings = {
  secret: process.env.SECRET,
  expiresIn: (process.env.EXPIRY_TIME_SECONDS && parseInt(process.env.EXPIRY_TIME_SECONDS, decimal)) || 3600
};
