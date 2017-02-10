import uuid from 'uuid'

class Message {
  constructor (attrs = {}) {
    this.body = attrs.body || ''
    this.type = attrs.type || 'upload'
    this.idKey = `x-${this.type}-id`
    this.eventKey = `x-${this.type}-event`
    this.id = setId(attrs, this.idKey)
    this.event = setEvent(attrs, this.eventKey)
  }

  subscriptionId () {
    return this.event + '@' + this.id
  }

  /// Adjust message headers based on recipient (browser or Rabbit)

  forClient (dest) {
    dest = dest || `/${this.type}/${this.event}`
    this.body = serialize(this.body)
    this.headers = Object.assign(
      this.baseHeaders(), {
      destination: dest,
      'message-id': uuid.v4()
    })
    return this
  }

  toBroker (broker = null) {
    let dest = `/topic/${this.type}.${this.event}`
    this.body = serialize(this.body)
    this.headers = Object.assign(
      this.baseHeaders(), {
      ack: 'client',
      destination: dest
    })
    if (broker) this.broker = broker
    return this
  }

  send (opts = {}) {
    let dest = opts.destination || this.headers.destination
    if (this.hasOwnProperty('broker')) {
      this.headers['timestamp'] = Date.now()
      this.broker.send(dest, this.body, this.headers)
      return this
    } else {
      throw `No broker to send message via.`
    }
  }

  /// Headers

  baseHeaders () {
    let obj = {}
    obj[this.idKey] = this.id
    obj[this.eventKey] = this.event
    obj['content-type'] = this.contentType()
    obj['subscription'] = this.subscriptionId()
    return obj
  }

  contentType () {
    return IsJSONString(this.body) ? 'application/json' : 'text/plain'
  }
}

function setEvent (attrs, eventKey) {
  if (attrs.hasOwnProperty('headers')) {
    return attrs.headers[eventKey]
  } else {
    return attrs.event || 'init'
  }
}

function setId (attrs, idKey) {
  if (attrs.hasOwnProperty('headers')) {
    return attrs.headers[idKey]
  } else {
    return attrs.id || uuid.v4()
  }
}

/// Serialization

function serialize (body) {
  return typeof body === 'string' ? body : JSON.stringify(body)
}

function deserialize (body) {
  return IsJSONString(body) ? JSON.parse(body) : body
}

function IsJSONString (str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

/// Exports

export { Message }
