import { Files, Message, Subscriptions } from './../lib'

export default function initBroker (broker) {

  //// Topic: `chunk.ready'

  broker.subscribe('/topic/chunk.ready', (message) => {
    let file = Files.getByChunkId(message.headers['x-chunk-id'])
    let msg = new Message({
      id:    file.id,
      event: 'ready',
      type:  'upload',
      body:  message.body
    })
    msg.forClient()
    Subscriptions.broadcast(msg.subscriptionId(), msg)
  }, { id: 'broker-chunk.ready' })


  //// Topic: `chunk.done'

  broker.subscribe('/topic/chunk.done', (message) => {
    let chunkId = message.headers['x-chunk-id']
    let file = Files.getByChunkId(chunkId)
    file.setChunkDone(chunkId)
    if (file.isDone()) {
      let msg = new Message({
        id:    file.id,
        event: 'done',
        type:  'upload',
        body:  file.toPayload()
      })
      msg.toBroker(broker).send()
    }
  }, { id: 'broker-chunk.done' })


  //// Topic: `upload.#`

  broker.subscribe('/topic/upload.#', (message) => {
    Subscriptions.forward(message)
  }, { id: 'broker-upload.all' })


  //// Topic: `upload.done.*`

  broker.subscribe('/topic/upload.done', (message) => {
    let file = Files.get(message.headers['x-upload-id'])
    file.save()
        .on('success', () => {
          let msg = new Message({
            id:    file.id,
            event: 'create',
            type:  'upload',
            body:  file.toPayload()
          })
          msg.toBroker(broker).send()
        })
        .on('error', (err) => {
          console.log(`Could not save Upload :(`)
        })

  }, { id: 'broker-upload.done' })
}
