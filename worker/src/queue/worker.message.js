const topicResource  = process.env.TOPIC_RESOURCE

export default class Message {
  constructor (evt, attrs) {
    this.event = evt
    this.destination = `${topicResource}.${evt}`
    this.body = setBody(attrs)

    // Note: message-id and subscription are set by RabbitMQ
    this.headers = {
      'x-chunk-event': evt,
      'x-chunk-id': attrs.id,
      'content-type': getContentType(this.body),
      'timestamp': Date.now()
    }
  }
}

function setBody (attrs) {
  if (Object.keys(attrs).length > 1) {
    return JSON.stringify({ chunk: attrs })
  } else {
    return ''
  }
}

function getContentType (body) {
  return typeof body === 'object' ? 'application/json' : 'text/plain'
}
