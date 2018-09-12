const defaultLogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'info';
const logLevel = process.env.LOG_LEVEL || defaultLogLevel;

export const settings = {
  defaultLogLevel,
  logLevel
};
