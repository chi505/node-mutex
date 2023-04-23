import { MutexService } from "./src/services/mutex.service"

import express from 'express'
import bodyParser from 'body-parser'
import { createClient } from "redis"

const app = express()
const port = 3000

const redisClient = createClient()
redisClient.connect();
redisClient.on('error', err => console.log('Redis Client Error', err));

const mutexService = new MutexService(redisClient);
app.use(bodyParser.json()) // for parsing application/json

// Acquire endpoint
// Returns a 200 with the key value if lock acquired
// Returns a 409 if lock already held by another client
app.post('/acquire', async (req: any, res: any) => {
  const retVal = await mutexService.acquire(req.body.lock, req.body.timeout);
  if (retVal) {
    res.send(retVal);
  } else {
    res.status(409).send(`Lock ${req.body.lock} already acquired.`);
  }
})

// Release endpoint
// Returns a 200 if lock released (with valid key)
// Returns a 403 if invalid key provided
// Returns a 404 if lock is not held
app.post('/release', async (req: any, res: any) => {
  const retVal = await mutexService.release(req.body.lock, req.body.key);
  res.sendStatus(retVal);
})

app.listen(port, () => {
  console.log(`Mutex listening on port ${port}`)
})