import axios from 'axios'

export class MutexClient {
    private heldLocks: Map<string, string> = new Map<string, string>();
    constructor(readonly apiUrl: string) { }

    async acquire(lock: string, timeout?: number) {
        const response = await axios.post(`${this.apiUrl}/acquire`, {
                lock, timeout
            });

        if (response.status !== 200) {
            throw new Error(`Failed to acquire resource ${lock}: ${response.status}`);
        }

        this.heldLocks.set(lock, response.data);
    }

    async release(lock: string) {
        if (!this.heldLocks.has(lock)) {
            throw new Error("Lock not held by client.")
        }
        const response = await axios.post(`${this.apiUrl}/release`, {
            lock,
            key: this.heldLocks.get(lock)
        });
        if (response.status !== 200) {
            throw new Error(`Failed to release resource ${lock}: ${response.status}`);
        }
        this.heldLocks.delete(lock);
    }
}

export default MutexClient;