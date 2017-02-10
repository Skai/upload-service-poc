import * as types from './../mutation-types'

const state = {
  all: []
}

const getters = {
  allUploads (state) {
    return state.all
  },

  uploadById: (state, getters) => (id) => {
    return uploadById(state, id)
  },

  queuedUploads (state) {
    return state.all.filter(upload => upload.status === 'queued')
  },

  processingUploads (state) {
    return state.all.filter(upload => upload.status === 'uploading')
  },

  doneUploads (state) {
    return state.all.filter(upload => upload.status === 'created')
  }
}

const mutations = {
  [types.NEW_UPLOAD] (state, attrs) {
    state.all.push({ ...attrs.upload, status: 'queued' })
  },

  [types.CHUNK_BEGIN] (state, attrs) {
    uploadById(state, attrs.chunk.uploadId).status = 'uploading'
  },

  [types.UPLOAD_CREATED] (state, attrs) {
    let upload = uploadById(state, attrs.upload.id)
    upload.status = 'created'
    for (let key in attrs.upload) {
      upload[key] = attrs.upload[key]
    }
  }
}

function uploadById (state, id) {
  return state.all.find(upload => upload.id === id)
}

export default {
  state,
  getters,
  mutations
}
