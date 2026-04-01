import Redis from 'ioredis';
import configs from './env.config.js';

const { REDIS_DB, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = configs;

// Cấu hình các thông số kết nối
const redisConfig = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  db: REDIS_DB
  // keyPrefix: 'my_app:', // Tiền tố cho mọi key để tránh trùng lặp
};

const redis = new Redis(redisConfig);

// Kiểm tra kết nối
redis.on('connect', () => {
  console.log('✅ Redis client connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});

export default redis;