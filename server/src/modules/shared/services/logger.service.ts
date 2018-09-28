import { createLogger, format, LoggerOptions, transports } from 'winston';
// tslint:disable-next-line
const PrettyError = require('pretty-error');

import { settings } from '../settings';

const { combine, timestamp, splat, colorize, label } = format;

export class LoggerService {
  private readonly logger;
  private readonly prettyError = new PrettyError();

  constructor(private context: string, transport?) {
    this.logger = createLogger({
      format: this.buildFormat(),
      transports: [
        new transports.Console({
          level: settings.logLevel
        })
      ]
    });
    this.prettyError.skipNodeFiles();
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
  }

  private buildFormat() {
    return combine(
      colorize(),
      label({ label: this.context }),
      timestamp(),
      splat(),
      format.printf(info => {
        return `[${info.timestamp}]-${info.level} (${info.label}): ${info.message}`;
      })
    );
  }

  get Logger() {
    return this.logger;
  }

  log(...message): void {
    const currentDate = new Date();

    this.logger.info(...message, {
      timestamp: currentDate.toISOString(),
      context: this.context
    });
  }

  error(message: string, trace?: any): void {
    const currentDate = new Date();
    const processedTrace = trace instanceof Object ? JSON.stringify(trace, null, 2) : trace;

    this.logger.error(`${message} -> (${processedTrace || 'trace not provided !'})`, {
      timestamp: currentDate.toISOString(),
      context: this.context
    });
  }

  warn(...message): void {
    const currentDate = new Date();
    this.logger.warn(...message, {
      timestamp: currentDate.toISOString(),
      context: this.context
    });
  }

  overrideOptions(options: LoggerOptions) {
    this.logger.configure(options);
  }
}
