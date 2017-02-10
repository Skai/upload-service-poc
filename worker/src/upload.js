import { EventEmitter } from 'events'
import Busboy from 'busboy'
import fs from 'fs'
import os from 'os'
import path from 'path'

const uploadPath = '/tmp/uploads'

export default class Upload extends EventEmitter {
  constructor (id, httpHeaders) {
    super()
    let location = path.join(uploadPath, id)
    let busboy = new Busboy({ headers: httpHeaders })

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      file.on('data', (data) => { this.emit('file:streaming', data) })
      file.on('limit', () => { this.emit('file:limit') })
      file.on('end', () => { this.emit('file:end') })
      file.pipe(fs.createWriteStream(location))
    })

    busboy.on('finish', () => {
      this.emit('form:finish')
    })

    return busboy
  }
}
