import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';

function getMonthName(day: number) {
  const miFecha = new Date();
  if (0 <= day && day < 12) {
    miFecha.setMonth(day);
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(miFecha);
  } else {
    return null;
  }
}

const month: number = new Date().getMonth();
const monthName = getMonthName(month);

const transports = {
  console: new winston.transports.Console({
    level: 'silly',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.colorize({
        colors: {
          info: 'blue',
          debug: 'yellow',
          error: 'red',
        },
      }),
      winston.format.printf((info) => {
        return `${info.timestamp} [${info.level}] [${
          info.context ? info.context : info.stack
        }] ${info.message}`;
      }),
    ),
  }),
  combinedFile: new winstonDailyRotateFile({
    dirname: `./logs/${monthName}`,
    filename: 'combined',
    extension: '.log',
    level: 'info',
  }),
  errorFile: new winstonDailyRotateFile({
    dirname: `./logs/${monthName}`,
    filename: 'error',
    extension: '.log',
    level: 'error',
  }),
};

export const logger = WinstonModule.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: [
    transports.console,
    transports.combinedFile,
    transports.errorFile,
  ],
});
