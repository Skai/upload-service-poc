import { StompService } from './../stomp.service'

class Subscriptions {
  constructor () {
    this.subs = {}
  }

  add (dest, fileId, cb) {
    let evt = dest.split('/')[2]
    let id = this.getSubId(evt, fileId)
    this.subs[id] = StompService.subscribe(dest, cb, { id: id })
  }

  remove (evt, fileId) {
    let id = this.getSubId(evt, fileId)
    this.subs[id].unsubscribe()
  }

  getSubId (evt, fileId) {
    return evt + '@' + fileId
  }
}

let subs = new Subscriptions()
export { subs as Subscriptions }
