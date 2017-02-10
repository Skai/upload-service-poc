import { HttpService, StompService } from './../index'
import store from './../../store'
import { bus } from './../../bus'
import { Files } from './files'
import { Subscriptions } from './subscriptions'

class UploadService {

  // @param file {File} JS type
  newFile (file) {
    HttpService.get('/api/upload/new').then((res) => {
      let id = JSON.parse(res).subscription.id
      Files.add(id, file)
      let attrs = Files.getAttrs(id)
      let headers = {
        'x-upload-id': id,
        'x-upload-event': 'new'
      }

      Subscriptions.add('/upload/ready', id, onReady)
      Subscriptions.add('/upload/create', id, onCreate)
      StompService.send('/upload/new', { upload: attrs }, headers)

      store.dispatch('newUpload', { upload: attrs })
    })
  }
}

function onReady (message) {
  let uploadId = message.headers['x-upload-id']
  let file = Files.get(uploadId)
  let chunk = Object.assign({ uploadId: uploadId }, JSON.parse(message.body).chunk)
  let blob = HttpService.uploadBlob(chunk.route, file.slice(chunk.start, chunk.end))

  store.dispatch('beginChunk', { chunk: chunk })

  blob.on('percentage', function (str) {
    bus.emit('percentage', str, chunk.id)
  })

  blob.on('loadend', function (evt) {
    store.dispatch('doneChunk', { chunk: chunk })
  })
}

function onCreate (message) {
  let id = message.headers['x-upload-id']
  let attrs = Object.assign(
    Files.getAttrs(id),
    JSON.parse(message.body).upload
  )
  store.dispatch('uploadCreated', { upload: attrs })

  Subscriptions.remove('ready', id)
  Subscriptions.remove('create', id)
  Files.remove(id)
}

const service = new UploadService()
Object.freeze(service)

export { service as UploadService }
