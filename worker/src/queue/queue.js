import { EventEmitter } from 'events'
import webstomp from 'webstomp-client'

import { Tasks } from './tasks'
import TCPSocket from './tcp.connection'
import Message from './worker.message'

// -- Messages --
// <<< /queue/upload
// >>> /topic/chunk.<event>.<id>

const queueName = process.env.QUEUE_NAME
const workerName = process.env.WORKER_NAME
const host = process.env.BROKER_HOST
const port = process.env.BROKER_PORT

let broker, subscription, _queue

export default class Queue extends EventEmitter {
  constructor (opts = {}) {
    super()
    this.user = opts.user || 'guest'
    this.pass = opts.pass || 'guest'
    this.debug = opts.hasOwnProperty('debug') ? opts.debug : true

    this.connect()
    _queue = this
  }

  connect () {
    let tcp = new TCPSocket(host, port)
    let opts = {
      heartbeat: { incoming: 0, outgoing: 0 }
    }
    broker = webstomp.over(tcp, opts)
    broker.connect(this.user, this.pass, onConnect, onError)
  }

  disconnect () {
    return broker.disconnect()
  }

  transmit (evt, attrs) {
    log(`Transmit ${evt}`, attrs)
    let msg = new Message(evt, attrs)
    broker.send(msg.destination, msg.body, msg.headers)
    housekeeping(evt, attrs.id)
  }
}

function onConnect (frame) {
  log(`=== [${workerName}] connected to RabbitMQ - ${frame.headers.session} ===`)
  subscribe(frame.headers.session)
  _queue.emit('connect')
}

function onError (error) {
  log(`=== [${workerName}] error connecting to RabbitMQ ===`, error)
  _queue.emit('error', error)
}

function onMessage (message) {
  log(`=== [${workerName}] received message ===`)
  log(message)

  let attrs = JSON.parse(message.body).chunk
  Tasks.add(attrs.id, message)
  _queue.emit('message', attrs)
}

function subscribe (sessionId) {
  let hdrs = {
    ack: 'client',
    id: sessionId.replace(/session/, workerName)
  }
  subscription = broker.subscribe(queueName, onMessage, hdrs)
}

function housekeeping (evt, id) {
  switch (evt) {
    case 'done': {
      Tasks.get(id).ack()
      Tasks.remove(id)
      break
    }
    case 'limit':
    case 'error': {
      Tasks.get(id).nack()
      Tasks.remove(id)
      break
    }
  }
}

function log (...args) {
  if (_queue.debug) {
    console.log(...args)
  }
}
