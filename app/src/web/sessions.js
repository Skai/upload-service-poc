import crypto from 'crypto'
import express from 'express'
import session from 'express-session'
import redis from 'redis'

const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT

let secret = crypto.randomBytes(64).toString('hex')
let client = redis.createClient(port, host)
let RedisStore = require('connect-redis')(session)
let middleware = session({
  store: new RedisStore({
    client: client
  }),
  secret: secret,
  resave: false,
  saveUninitialized: true
})

export default middleware
