import { MutexService } from "../src/services/mutex.service"
import { ReleaseTypes } from "../src/types/release-types";

describe("MutexService", ()=>{
    let mutexService: MutexService = new MutexService();
    beforeEach(()=>{
        MutexService.clearLocks();
    })
    it("should return a key when a lock is acquired for the first time", ()=>{
        const key = mutexService.acquire('lock');
        expect(key).not.toBeNull();
    })
    it("should return null when the same lock is acquired for the second time without being released", ()=>{
        const key1 = mutexService.acquire('lock');
        const key2 = mutexService.acquire('lock');
        expect(key2).toBeNull();
    })
    it("should return a new key when the same lock is acquired for the second time after being released", ()=>{
        const key1 = mutexService.acquire('lock');
        mutexService.release('lock', key1 as string);
        const key2 = mutexService.acquire('lock');
        expect(key2).not.toBeNull();
        expect(key1).not.toEqual(key2);
    })
    it("should return a 200 status code when the lock is released with the correct key", ()=>{
        const key = mutexService.acquire('lock');
        const result = mutexService.release('lock', key as string);
        expect(result).toEqual(ReleaseTypes.Released);
    })
    it("should return a 404 status code when a lock is released that doesn't exist", ()=>{
        const result = mutexService.release('lock', "");
        expect(result).toEqual(ReleaseTypes.NotFound);
    })
    it("should return a 403 status code when a lock is released with the wrong key", ()=>{
        const key = mutexService.acquire('lock');
        const result = mutexService.release('lock', "");
        expect(result).toEqual(ReleaseTypes.InvalidKey);
    })
})