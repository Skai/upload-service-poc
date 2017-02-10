import { Broker, Clients } from './lib/stomp'
import { Files, Message, Subscriptions } from './lib'

import initBroker from './routes/broker.routes'
import initClients from './routes/client.routes'

export default class App {
  constructor (httpServer) {
    this.broker = new Broker({ debug: true })
    this.clients = new Clients(httpServer, { debug: false })

    this.broker.connect().on('connect', () => { initBroker(this.broker) })
    initClients(this.clients, this.broker)
  }
}
