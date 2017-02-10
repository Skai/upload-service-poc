import { Server as WebSocketServer } from 'ws'
import { EventEmitter } from 'events'
import webstomp from 'webstomp-client'
import StompClient from './client'

let clients = {}
let wsServer, _this

class ClientConnections extends EventEmitter {
  constructor (httpServer, opts = {}) {
    super()
    _this = this
    this.debug = opts.debug || false

    // Init ws interface to users
    wsServer = new WebSocketServer({ server: httpServer })

    // New connection from user
    wsServer.on('connection', (ws) => {
      let client = new StompClient(ws, { debug: false })
      if (client.isAuthenticated) {
        clients[client.sessionId] = client
        log(`New authenticated client: ${client.sessionId}`)
        listenTo(client)
      }
    })
  }

  clients () {
    return Object.assign({}, clients)
  }

  send (clientId, ...args) {
    clients[clientId].send(...args)
  }
}

function listenTo (client) {
  client.on('SEND', function (frame) {
    _this.emit('SEND', frame, client)
  })

  client.on('SUBSCRIBE', function (frame) {
    _this.emit('SUBSCRIBE', frame, client)
  })
}

function log (...args) {
  if (_this.debug) {
    console.log(...args)
  }
}

export { ClientConnections }