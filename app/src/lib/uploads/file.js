import crypto from 'crypto'
import { EventEmitter } from 'events'
import { Chunks } from './chunks'
import { Upload as UploadModel } from './mongo-schema'

const attributes = ['id', 'name', 'contentType', 'lastModifiedDate', 'size', 'url']

class File {
  constructor (attrs = {}) {
    this.id = newId()
    this.url = this.url || ''
    extend (this, attrs)
    this.chunks = new Chunks(parseInt(this.size), this.id)
  }

  fromAttrs (attrs = {}) {
    extend (this, attrs)
    return this
  }

  isDone () {
    return this.chunks.allDone()
  }

  setChunkDone (chunkId) {
    this.chunks.setDone(chunkId)
  }

  toAttrs () {
    let attrs = {}
    attributes.forEach((key) => {
      if (this.hasOwnProperty(key)) {
        attrs[key] = this[key]
      }
    })
    Object.assign(attrs, { chunks: this.chunks.sort().ids().toString() })
    return attrs
  }

  toPayload () {
    return {
      upload: this.toAttrs()
    }
  }

  save () {
    let bus = new EventEmitter()
    let upload = new UploadModel(this.toAttrs())
    upload.save((err) => {
      if (err) {
        bus.emit('error', 'Sorry, there was a problem saving the upload.')
      } else {
        this.url = `/api/download/${this.id}`
        bus.emit('success', this.toAttrs())
      }
    })

    return bus
  }
}

function extend (_this, attrs = {}) {
  for (let key in attrs) {
    if (attributes.includes(key)) {
      _this[key] = attrs[key]
    }
  }
}

function newId () {
  return crypto.randomBytes(16).toString('hex')
}

export { File }
