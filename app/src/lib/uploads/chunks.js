import { Chunk } from './chunk'

const chunkSize = parseInt(process.env.CHUNK_SIZE) || 1048576 // 1 MB

let _this

class Chunks {
  constructor (fileSize, uploadId) {
    _this = this
    this.uploadId = uploadId
    this.chunks = []
    initChunks(fileSize)
  }

  all () {
    return this.chunks
  }

  sort () {
    this.chunks.sort((a, b) => {
      if (a.start < b.start) return -1
      if (a.start > b.start) return 1
      return 0
    })
    return this
  }

  ids () {
    let ids = []
    this.chunks.forEach(chunk => ids.push(chunk.id))
    return ids
  }

  allDone () {
    return this.chunks.every(chunk => chunk.done === true)
  }

  byId (id) {
    return this.chunks.find(chunk => chunk.id === id)
  }

  setDone(id) {
    this.byId(id).done = true
  }
}

function initChunks (fileSize) {
  fileSize = parseInt(fileSize)
  let start = 0
  let end = chunkSize

  while (start < fileSize) {
    let chunk = new Chunk(start, end, _this.uploadId)
    _this.chunks.push(chunk)
    start = end
    end = start + chunkSize
  }
}

export { Chunks }
