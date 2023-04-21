# node-mutex
This is a lightweight in-memory networked concurrency primitive.

Usage:

`POST localhost:3000/acquire`
`{"lock": lockName}`
Attempts to acquire a lock named `lockName`. If the lock is free, acquires it and returns a UUID used to release it when done. Otherwise returns a 409.

`POST localhost:3000/release`
`{"lock": lockName, "key": key}`
Attempts to release the lock named `lockName`. If the supplied `key` is the value returned by the acquire call, releases the lock and returns a 200. If `lockName` does not exist, returns a 404. If the supplied key is invalid, returns a 403.
