import winston from 'winston';

export const logsMemoria = [];

const customFormat = winston.format.printf(({ level, message }) => {
  const timestamp = new Date().toISOString();
  
  logsMemoria.unshift({ 
      time: timestamp, 
      level: level.toUpperCase(), 
      msg: message 
  });
  
  if (logsMemoria.length > 100) {
      logsMemoria.pop();
  }

  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
});

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.simple(),
    customFormat
  ),
  transports: [
    new winston.transports.Console()
  ]
});