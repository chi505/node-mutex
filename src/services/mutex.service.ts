import { v4 as uuidv4 } from 'uuid';

export class MutexService {

    // In a real service, this would be backed by Redis or similar
    private static locks: Map<string, string> = new Map<string, string>();

    // Check if lock already held, generate a UUID for the key and return it if not
    acquire(lock: string): string | null {
        if (!MutexService.locks.has(lock)) {
            const uuid = uuidv4();
            MutexService.locks.set(lock, uuid)
            return uuid;
        }
        return null;
    }

    // Check if lock exists, return 404 if not.
    // If invalid key provided, return 403.
    release(lock: string, key: string): number {
        if (!MutexService.locks.has(lock)) {
            return 404;
        }
        if (MutexService.locks.get(lock) === key) {
            MutexService.locks.delete(lock);
            return 200;
        }
        else {
            return 403;
        }
    }

}