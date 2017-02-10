import express from 'express'
import Queue from './queue/queue'
import Upload from './upload'

const port = process.env.PORT
const workerName = process.env.WORKER_NAME

let http = express()
let queue = new Queue({ debug: false })

queue.on('connect', () => {
  http.listen(port, () => {
    console.log(`=== [${workerName}] listening on ${port}… ===` )
  })
})

queue.on('message', (attrs) => {
  let route = `/api/${workerName}/upload/${attrs.id}`
  queue.transmit('ready', Object.assign({ route: route }, attrs))

  http.post(`/upload/${attrs.id}`, (req, res) => {
    let upload = new Upload(attrs.id, req.headers)
    queue.transmit('begin', attrs)

    // Noisy Logs
    // upload.on('file:streaming', (data) => {
    //   queue.transmit('progress', attrs)
    // })

    upload.on('file:end', () => {
      queue.transmit('done', attrs)
      res.writeHead(200, { 'Connection': 'close' })
      res.end("That's all folks!")
    })

    // Not sharding
    // upload.on('form:finish', () => {
    //   exit(attrs)
    // })

    return req.pipe(upload)
  })
})

function exit (attrs) {
  setTimeout(() => {
    queue.disconnect(() => {
      process.exit(0)
      queue.transmit('exit', attrs)
    })
  }, 300)
}
