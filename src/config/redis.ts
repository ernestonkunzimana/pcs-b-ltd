import { createClient, RedisClientType } from 'redis';
import { config } from 'dotenv';

config();

let redisClient: RedisClientType;

export const connectRedis = async (): Promise<void> => {
  try {
    redisClient = createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB || '0'),
    });

    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
};

export const getRedisClient = (): RedisClientType => {
  return redisClient;
};

export const setCache = async (key: string, value: string, ttl: number = 3600): Promise<void> => {
  await redisClient.setEx(key, ttl, value);
};

export const getCache = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};

export const deleteCache = async (key: string): Promise<void> => {
  await redisClient.del(key);
};