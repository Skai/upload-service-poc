import { EventEmitter } from 'events'
import { Frame } from 'stompjs'
import Heartbeats from './../heartbeats'
import StompFrame from './../frame'

/**
 * Custom Stomp Client for users
 *
 * Differences from webstomp-client:
 * - authenticates web socket based on express session
 * - sends CONNECT frame back to user
 * - emits stomp commands as events
 */

const sessionKey = 'connect.sid'
let debug, heartbeats, _this

export default class StompClient extends EventEmitter {
  constructor (ws, opts) {
    super()
    debug = opts.debug || false
    this.isAuthenticated = false

    if (authenticate(ws)) {
      _this = this
      this.ws = ws
      this.sessionId = getSessionId(ws)
      this.isAuthenticated = true
      init(ws)
    }
  }

  send (body = '', headers) {
    let out = new StompFrame('MESSAGE', headers, body)
    this.ws.send(out.marshall())
  }
}

function init (ws) {
  ws.on('message', (message) => {
    _this.emit('message', message)
    let frames = Frame.unmarshall(message)

    frames.forEach((frame) => {
      _this.emit(frame.command, frame)
      log(frame)
      if (frame.command === 'CONNECT') {
        let connected = new StompFrame('CONNECTED', { 'heart-beat': frame.headers['heart-beat'] })
        ws.send(connected.marshall())
        heartbeats = new Heartbeats(ws, frame.headers)
      }
    })
  })

  ws.on('close', (code, reason) => {
    _this.emit('disconnect', {
      code: code,
      reason: reason
    })

    console.log(`Web Socket closed, code: ${code}:`)
    console.log(reason)
    heartbeats.stop()
  })

  ws.on('error', (error) => {
    _this.emit('error', error)
    log('Web Socker error', error)
  })
}

function authenticate (ws) {
  if (hasSession(ws)) {
    return true
  } else {
    ws.close(1008, 'Not authorized. Please login and try again.')
    return false
  }
}

function hasSession (ws) {
  let cookie = ws.upgradeReq.headers.cookie
  return (cookie && cookie.split('=')[0] == sessionKey)
}

function getSessionId (ws) {
  return ws.upgradeReq.headers.cookie.split('=')[1];
}

function log (...args) {
  if (debug) {
    console.log(...args)
  }
}