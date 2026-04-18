type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

const SENSITIVE_KEYS = ['password', 'token', 'authorization', 'jwt', 'secret'];

function maskSensitive(obj: Record<string, any>): Record<string, any> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const isSensitive = SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k));
    acc[key] = isSensitive ? '***' : value;
    return acc;
  }, {} as Record<string, any>);
}

function format(level: LogLevel, context: string, message: string, meta?: Record<string, any>): string {
  const timestamp = new Date().toISOString();
  const maskedMeta = meta ? maskSensitive(meta) : undefined;
  const metaStr = maskedMeta ? ` ${JSON.stringify(maskedMeta)}` : '';
  return `[${timestamp}] [${level}] [${context}] ${message}${metaStr}`;
}

export const logger = {
  info(context: string, message: string, meta?: Record<string, any>) {
    console.log(format('INFO', context, message, meta));
  },
  warn(context: string, message: string, meta?: Record<string, any>) {
    console.warn(format('WARN', context, message, meta));
  },
  error(context: string, message: string, meta?: Record<string, any>) {
    console.error(format('ERROR', context, message, meta));
  },
  debug(context: string, message: string, meta?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(format('DEBUG', context, message, meta));
    }
  },
};
