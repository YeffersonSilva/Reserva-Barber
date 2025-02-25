import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const paymentRateLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'payment-ratelimit:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos de pago por IP
  message: {
    status: 'error',
    message: 'Demasiados intentos de pago. Por favor, intente más tarde.'
  }
}); 