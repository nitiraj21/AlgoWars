import { createClient } from 'redis';

export const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-15120.crce182.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 15120
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

await redisClient.set('foo', 'bar');
const result = await redisClient.get('foo');
console.log(result)  // >>> bar

