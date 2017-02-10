import net from 'net'

/**
 * Wrap TCP Connection as web socket object
 *
 * Used for `webstomp-client` module to connect to RabbitMQ. Original source:
 * https://github.com/jmesnil/stomp-websocket/blob/master/src/stomp-node.orig.js
 */
export default class TCPSocket {
  constructor (host, port) {
    return fakeSocket(host, port)
  }
}

function fakeSocket (host, port) {
  var socket, ws
  socket = null
  ws = {
    url: 'tcp:// ' + host + ':' + port,
    send: function(d) {
      return socket.write(d)
    },
    close: function() {
      return socket.end()
    }
  }

  socket = net.connect(port, host, function(e) {
    return ws.onopen()
  })

  socket.on('error', function(e) {
    return typeof ws.onclose === "function" ? ws.onclose(e) : void 0
  })

  socket.on('close', function(e) {
    return typeof ws.onclose === "function" ? ws.onclose(e) : void 0
  })

  socket.on('data', function(data) {
    var event
    event = {
      'data': data.toString()
    }
    return ws.onmessage(event)
  })

  return ws
}
