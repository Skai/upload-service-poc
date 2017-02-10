import crypto from 'crypto'
import express from 'express'
import fs from 'fs'
import path from 'path'
import sessions from './sessions'
import authentication from './authentication'
import { Upload } from './../lib/uploads/mongo-schema'

const uploadsPath = process.env.UPLOADS_PATH || '/tmp'
let app = express()

/// Middleware

app.use(sessions)
app.use(authentication)

/// Routes

app.get('/api/upload/new', function (req, res) {
  let id = crypto.randomBytes(16).toString('hex')
  res.json({
    subscription: {
      id: id,
    }
  })
})

app.get('/api/download/:id', function (req, res) {
  let id = req.params.id

  Upload.findOne({id: id}, (err, upload) => {
    if (!err && upload) {
      let chunks = upload.chunks.split(',')
      res.set({
        'Content-Type': upload.contentType,
        'Content-Disposition': `attachment; filename="${upload.name}"`
      })
      pipeChunks(chunks, res)
    } else {
      if (err) console.log(err)
      res.status(404).send('File not found')
    }
  })
})

app.get('/login', function (req, res) {
  req.session.user = 'foo'
  res.send('session set')
})

app.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err)
    } else {
      res.send('session deleted')
    }
  })
})

const pipeChunks = function (chunks, wstream) {
  if (chunks.length === 0) {
    wstream.end('fin!')
    return
  }
  let chunk = path.join(uploadsPath, chunks.shift())
  let rstream = fs.createReadStream(chunk)
  rstream.pipe(wstream, { end: false })
  rstream.on('end', () => {
    pipeChunks(chunks, wstream)
  })
}

export default app
