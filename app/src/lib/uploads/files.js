import { File } from './file'

class Files {
  constructor () {
    this.files = {}
    this.chunksMap = {}
  }

  add (file) {
    this.files[file.id] = file
    file.chunks.all().forEach((chunk) => {
      this.chunksMap[chunk.id] = file.id
    })
  }

  new (attrs) {
    let file = new File(attrs)
    this.add(file)
    return file
  }

  get (id) {
    return this.files[id]
  }

  remove (id) {
    delete this.files[id]
  }

  getByChunkId (cid) {
    return this.get(this.chunksMap[cid])
  }
}

let files = new Files()
export { files as Files }
