import { config } from 'dotenv';

declare const process: {
  env: {
    [key: string]: string;
  };
};
config(); // load .env file

export const Env = (key: string, fallback: any = null) => {
  return process.env[key] === '' ? fallback : process.env[key];
};
