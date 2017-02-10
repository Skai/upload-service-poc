import uuid from 'uuid'

class Chunk {
  constructor(start, end, uploadId) {
    this.uploadId = uploadId
    this.start = start
    this.end = end
    this.done = false
    this.id = uuid.v4()
  }

  toAttrs () {
    return {
      id: this.id,
      start: this.start,
      end: this.end
    }
  }

  toPayload () {
    return {
      chunk: this.toAttrs()
    }
  }
}

export { Chunk }
