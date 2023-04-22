import { MutexClient } from ".."

describe("MutexClient", ()=>{
    const client = new MutexClient("http://localhost:3000");

    it("should acquire and release the lock", async ()=>{
        await client.acquire('lock');
        await client.release('lock');
    })
})