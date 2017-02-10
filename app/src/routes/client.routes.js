import { Files, Message, Subscriptions } from './../lib'

const queueName = process.env.QUEUE_NAME

export default function initClients (clients, broker) {
  clients.on('SEND', (frame, client) => {
    if (frame.headers.destination == '/upload/new') {
      let attrs = JSON.parse(frame.body).upload
      let file = Files.new(attrs)
      queueChunks(file, broker)
    }
  })

  clients.on('SUBSCRIBE', (frame, client) => {
    Subscriptions.add(frame.headers.id, client)
  })
}

function queueChunks (file, broker) {
  file.chunks.all().forEach((chunk) => {
    let msg = new Message({
      id: chunk.id,
      event: 'new',
      type: 'chunk',
      body: chunk.toPayload()
    })
    msg.toBroker(broker).send({destination: queueName})
  })
}
