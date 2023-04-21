import { MutexService } from "./src/services/mutex.service"

import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 3000

const mutexService = new MutexService();
app.use(bodyParser.json()) // for parsing application/json

// Acquire endpoint
// Returns a 200 with the key value if lock acquired
// Returns a 409 if lock already held by another client
app.post('/acquire', (req: any, res: any) => {
  const retVal = mutexService.acquire(req.body.lock);
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
app.post('/release', (req: any, res: any) => {
  const retVal = mutexService.release(req.body.lock, req.body.key);
  res.sendStatus(retVal);
})

app.listen(port, () => {
  console.log(`Mutex listening on port ${port}`)
})