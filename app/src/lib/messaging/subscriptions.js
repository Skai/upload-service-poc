import { Message } from './message'

/**
 * Client Subscriptions Object
 *
 * @example
 *  {
 *    `<event>@<id>': [StompClient, StompClient]
 *  }
 */
let subs

export default class Subscriptions {
  constructor (opts = {}) {
    subs = {}
    this.debug = opts.debug || false
  }

  all () {
    return Object.assign({}, subs)
  }

  add (id, client) {
    if (!hasSubscriptions(id)) {
      subs[id] = []
    }
    subs[id].push(client)
    return true
  }

  forward (message) {
    let msg = new Message(message)
    let id = msg.subscriptionId()
    if (hasSubscriptions(id)) {
      this.broadcast(id, msg)
      return true
    } else {
      console.log(`No subscriptions for ${id}`)
      return false
    }
  }

  broadcast (id, msg) {
    msg.forClient()
    subs[id].forEach((client) => {
      client.send(msg.body, msg.headers)
    })
  }

  // TODO: handle UNSUBSCRIBE frames
  // remove (id, client) {
  // }
}

function hasSubscriptions (subId) {
  return subs.hasOwnProperty(subId)
}

let s = new Subscriptions()
export { s as Subscriptions }
