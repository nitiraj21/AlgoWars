import { createClient } from "redis";

let internalRedisClient: ReturnType<typeof createClient> | null = null;
let isConnecting = false;

async function getRedisClient() {
    // Return existing client if already connected
    if (internalRedisClient && internalRedisClient.isOpen) {
        return internalRedisClient;
    }

    // Wait if connection is in progress
    if (isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
        return getRedisClient();
    }

    // Check if Redis credentials are available
    if (!process.env.REDIS_PASS) {
        console.warn('REDIS_PASS not set, Redis features will be disabled');
        return null;
    }

    try {
        isConnecting = true;

        internalRedisClient = createClient({
            username: 'default',
            password: process.env.REDIS_PASS,
            socket: {
                host: 'redis-19012.c265.us-east-1-2.ec2.redns.redis-cloud.com',
                port: 19012,
                connectTimeout: 5000,
                reconnectStrategy: (retries) => {
                    if (retries > 3) {
                        console.error('Redis max connection retries reached');
                        return new Error('Max retries reached');
                    }
                    return Math.min(retries * 200, 1000);
                }
            }
        });

        internalRedisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });

        internalRedisClient.on('connect', () => {
            console.log('Redis connected successfully');
        });

        await internalRedisClient.connect();
        return internalRedisClient;

    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        internalRedisClient = null;
        return null;
    } finally {
        isConnecting = false;
    }
}

// Export safe wrapper that handles connection failures
export const redisClient = {
    multi: async () => {
        const client = await getRedisClient();
        if (!client) {
            throw new Error('Redis client not available');
        }
        return client.multi();
    },
    isAvailable: async () => {
        try {
            const client = await getRedisClient();
            return client !== null && client.isOpen;
        } catch {
            return false;
        }
    }
};