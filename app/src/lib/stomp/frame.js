import { Frame } from 'stompjs'

/**
 * Stomp Frame Wrapper
 *
 * extends stompjs `Frame` to validate required headers app sends to users
 * https://stomp.github.io/stomp-specification-1.2.html#Frames_and_Headers
 */
export default class StompFrame extends Frame {
  constructor (command, headers, body = '') {
    super()
    if (typeof body == 'string') {
      this.body = body
    } else {
      this.body = JSON.stringify(body)
      headers = Object.assign(headers, { 'content-type': 'application/json' })
    }
    this.headers = mergeHeaders(getSchema(command), headers)
    this.command = command
  }

  marshall () {
    return Frame.marshall(this.command, this.headers, this.body)
  }
}

function mergeHeaders (schema, hdrs) {
  let headers = Object.assign({}, schema.defaults, hdrs)
  checkHeaders(schema.required, headers)
  return headers
}

function checkHeaders (required, hdrs) {
  if (required.length > 0) {
    required.forEach((key) => {
      if (!hdrs.hasOwnProperty(key)) {
        throw `Frame header ${key} is required.`
      }
    })
  }
}

function getSchema (command) {
  let schema
  switch (command) {
    case 'CONNECTED': {
      schema = {
        required: ['version', 'heart-beat'],
        defaults: {
          'version': '1.2',
          'heart-beat': '0,0'
        }
      }
      break
    }
    case 'ERROR': {
      schema = {
        required: ['message'],
        defaults: {
          'content-type': 'text/plain'
        }
      }
      break
    }
    case 'MESSAGE': {
      schema = {
        required: ['destination', 'message-id', 'subscription'],
        defaults: {
          'content-type': 'text/plain'
        }
      }
      break
    }
    case 'RECEIPT': {
      schema = {
        required: ['receipt-id'],
        defaults: {}
      }
      break
    }
    default: {
      throw `Invalid Stomp command.`
    }
  }
  return schema
}