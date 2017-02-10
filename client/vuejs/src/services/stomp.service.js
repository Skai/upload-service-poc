import webstomp from 'webstomp-client'

class StompService {

  constructor () {
    const url = `ws://${window.location.hostname}/stomp`
    let opts = {
      heartbeat: {
        incoming: 30000,
        outgoing: 30000
      },
      debug: true
    }
    this.stomp = webstomp.client(url, opts)
  }

  connect () {
    let headers = {
      'client-id': '123'
    }

    this.stomp.connect(headers, function () {
      console.log('client is conncted to stomp')
    }, function (error) {
      console.log('error on connecting to stomp', error)
    })
  }

  send (dest, body = '', hdrs = {}) {
    Object.assign(hdrs, getContentType(body))
    body = isJSON(body) ? JSON.stringify(body) : body
    return this.stomp.send(dest, body, hdrs)
  }

  subscribe (dest, fn, hdrs) {
    return this.stomp.subscribe(dest, fn, hdrs)
  }

  unsubscribe (id) {
    return this.stomp.unsubscribe(id)
  }
}

function getContentType (body) {
  return {
    'content-type': isJSON(body) ? 'application/json' : 'text/plain'
  }
}

function isJSON (body) {
  return (typeof body === 'object')
}

const service = new StompService()
Object.freeze(service)

export { service as StompService }
