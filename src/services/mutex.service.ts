import { v4 as uuidv4 } from 'uuid';
import { ReleaseTypes } from '../types/release-types';
import { RedisClientType, createClient } from 'redis';

export class MutexService {

    private redisClient: RedisClientType;

    constructor(redisClient: any){
        this.redisClient = redisClient;
    }

    async init() {
        await this.redisClient.connect();
    }

    // Check if lock already held, generate a UUID for the key and return it if not
    async acquire(lock: string, timeout?: number): Promise<string | null> {
        if (!(await this.redisClient.get(lock))) {
            const uuid = uuidv4();
            await this.redisClient.set(lock, uuid, {
                NX: true,
                EX: timeout ?? 10
              });
            console.log(`Lock ${lock} acquired, key ${uuid}`)
            return uuid;
        }
        return null;
    }

    // Check if lock exists, return 404 if not.
    // If invalid key provided, return 403.
    // Return 200 on successful release.
    async release(lock: string, key: string): Promise<number> {
        const lockVal = await this.redisClient.get(lock);
        if (!lockVal) {
            return ReleaseTypes.NotFound;
        }
        if (lockVal === key) {
            await this.redisClient.del(lock);
            console.log(`Lock ${lock} released, key ${key}`)

            return ReleaseTypes.Released;
        }
        else {
            return ReleaseTypes.InvalidKey;
        }
    }

}