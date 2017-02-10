/**
 * Patch Heartbeats for our stomp server
 *
 * Code from webstomp-client package, which is apache licensed
 * meaning needs to be rewritten from scratch if to be used live...
 * https://github.com/JSteunou/webstomp-client/blob/master/src/client.js
 */
export default class Heartbeats {
  constructor (ws, headers) {
    this.ws = ws;
    this.binary = false;
    this.maxWebSocketFrameSize = 16 * 1024;
    this.heartbeat = { outgoing: 0, incoming: 0 };
    this._setupHeartbeat(headers);
  }

  stop () {
    clearInterval(this.pinger);
    clearInterval(this.ponger);
  }

  _setupHeartbeat (headers) {
    const [serverOutgoing, serverIncoming] = (headers['heart-beat'] || '0,0').split(',').map(v => parseInt(v, 10));
    this.heartbeat.outgoing = serverOutgoing;
    this.heartbeat.incoming = serverIncoming;

    if (!(this.heartbeat.outgoing === 0 || serverIncoming === 0)) {
      let ttl = Math.max(this.heartbeat.outgoing, serverIncoming);
      console.log(`send PING every ${ttl}ms`);
      this.pinger = setInterval(() => {
        this._wsSend(BYTES.LF);
        console.log('>>> PING');
      }, ttl);
    }

    if (!(this.heartbeat.incoming === 0 || serverOutgoing === 0)) {
      let ttl = Math.max(this.heartbeat.incoming, serverOutgoing);
      console.log(`check PONG every ${ttl}ms`);
      this.ponger = setInterval(() => {
        let delta = Date.now() - this.serverActivity;
        // We wait twice the TTL to be flexible on window's setInterval calls
        if (delta > ttl * 2) {
          console.log(`did not receive server activity for the last ${delta}ms`);
          this.ws.close(); ///
        }
      }, ttl);
    }
  }

  _wsSend (data) {
    if (this.isBinary) data = unicodeStringToTypedArray(data);
    console.log(`>>> length ${data.length}`);
    // if necessary, split the *STOMP* frame to send it on many smaller
    // *WebSocket* frames
    while (true) {
      if (data.length > this.maxWebSocketFrameSize) {
        this.ws.send(data.slice(0, this.maxWebSocketFrameSize));
        data = data.slice(this.maxWebSocketFrameSize);
        this.debug(`remaining = ${data.length}`);
      } else {
        return this.ws.send(data);
      }
    }
  }
}

const BYTES = {
  LF: '\x0A',   // LINEFEED byte (octet 10)
  NULL: '\x00'  // NULL byte (octet 0)
};
