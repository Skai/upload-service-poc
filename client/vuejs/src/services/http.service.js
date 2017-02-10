import { EventEmitter } from 'events'

/* eslint-disable no-useless-constructor */
class HttpService extends EventEmitter {

  constructor () {
    super()
  }

  get (url) {
    return _sendRequest({
      method: 'GET',
      url: url
    })
  }

  post (url, hdrs = {}) {
    let defaults = { 'Content-Type': 'application/x-www-form-urlencoded' }
    let headers = Object.assign({}, defaults, hdrs)
    return _sendRequest({
      method: 'POST',
      url: url,
      headers: headers
    })
  }

  uploadBlob (url, blob) {
    // still need for FormData for backend
    return this.uploadFile(url, blob)
  }

  uploadFile (url, file) {
    let bus = new EventEmitter()
    let formData = new FormData()
    formData.append('file', file)

    let xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    // Pass on standard events
    xhr.onload = (evt) => { bus.emit('load', evt) }
    xhr.onloadend = (evt) => { bus.emit('loadend', evt) }
    xhr.onerror = (evt) => { bus.emit('error', evt) }

    // Event: progress
    xhr.upload.onprogress = (evt) => {
      bus.emit('progress', evt)
      if (evt.lengthComputable) {
        let percentage = (evt.loaded / evt.total) * 100
        // Custom Event: percentage
        bus.emit('percentage', percentage)
      }
    }
    xhr.send(formData)

    return bus
  }
}

function _sendRequest (opts = {}) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()

    // Open request
    xhr.open(opts.method, opts.url)

    // Set headers
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    if (opts.headers) {
      for (let key in opts.headers) {
        if (opts.headers.hasOwnProperty(key)) {
          xhr.setRequestHeader(key, opts.headers[key])
        }
      }
    }

    xhr.onerror = (err) => {
      reject('Network Error', err)
    }

    xhr.onload = (evt) => {
      if (_isValidResponse(xhr.status)) {
        resolve(xhr.response)
      } else {
        reject(xhr)
      }
    }

    // Finally send request
    xhr.send()
  })
}

function _isValidResponse (code) {
  return [200, 201, 202].includes(parseInt(code))
}

const service = new HttpService()
Object.freeze(service)

export { service as HttpService }
