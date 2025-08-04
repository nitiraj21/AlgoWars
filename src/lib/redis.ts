import { createClient } from "redis";

export const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19012.c265.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 19012
    }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

if (!redisClient.isOpen) {
    redisClient.connect().catch(console.error);
  }