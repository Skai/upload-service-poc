import { EventEmitter } from 'events'
import webstomp from 'webstomp-client'
import TCPSocket from './tcp.connection'

const host = process.env.BROKER_HOST
const port = process.env.BROKER_PORT
let _this

class BrokerConnection extends EventEmitter {
  constructor (opts = {}) {
    super()
    this.debug = opts.debug || true
    this.user = opts.user || 'guest'
    this.pass = opts.pass || 'guest'
    _this = this
  }

  connect () {
    let tcp = new TCPSocket(host, port)
    let opts = {
      heartbeat: { incoming: 0, outgoing: 0 }
    }
    this.stomp = webstomp.over(tcp, opts)
    this.stomp.connect(this.user, this.pass, onConnect, onError)
    this.stomp.onreceive = onMessage

    return this
  }

  send (...args) {
    return this.stomp.send(...args)
  }

  subscribe (...args) {
    return this.stomp.subscribe(...args)
  }
}

function onConnect (frame) {
  _this.sessionId = frame.headers.session
  log(`=== [BrokerConnection] conncted to RabbitMQ - ${_this.sessionId} ===`)
  _this.emit('connect')
}

function onMessage (message) {
  log(`--- [BrokerConnection] got a message from RabbitMQ ---`)
  log(message)
  _this.emit('message', message)
}

function onError (error) {
  log('error on connecting to stomp', error)
  _this.emit('error', error)
}

function log (...args) {
  if (_this.debug) {
    console.log(...args)
  }
}

export { BrokerConnection }
