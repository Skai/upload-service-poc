class Files {
  constructor () {
    this.files = {}
  }

  add (id, file) {
    this.files[id] = file
  }

  remove (id) {
    delete this.files[id]
  }

  get (id) {
    return this.files[id]
  }

  getAttrs (id) {
    let file = this.get(id)
    let attrs = {
      id: id,
      name: file.name,
      contentType: file.type,
      lastModifiedDate: file.lastModifiedDate,
      size: file.size
    }

    if (file.url) {
      Object.assign(attrs, { url: file.url })
    }

    return attrs
  }
}

let files = new Files()
export { files as Files }
