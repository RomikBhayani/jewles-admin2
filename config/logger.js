const fs = require('fs');
const path = require('path');
const pino = require('pino');

// Create logs directory if it doesn't exist
const logsDir = process.env.LOG_DIR || './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const isDevelopment = process.env.NODE_ENV === 'development';

// Configure logger
const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  },
  isDevelopment
    ? process.stdout
    : pino.transport({
        targets: [
          {
            level: 'info',
            target: 'pino/file',
            options: { destination: path.join(logsDir, 'app.log') },
          },
          {
            level: 'error',
            target: 'pino/file',
            options: { destination: path.join(logsDir, 'error.log') },
          },
        ],
      })
);

// Stream for Morgan HTTP logging
logger.stream = {
  write: (message) => logger.info(message.toString().trim()),
};

module.exports = logger;
