import Redis from 'ioredis';
import configs from './env.config.js';

const { REDIS_DB, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = configs;

export const redisConfig = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  db: REDIS_DB,
};

const redis = new Redis({
  ...redisConfig,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
});

redis.on('connect', () => {
  console.log('✅ Redis client connected');
});

redis.on('ready', () => {
  console.log('🚀 Redis ready to use');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});

export default redis;