import * as types from './../mutation-types'

const state = {
  all: []
}

const getters = {
  chunksByUploadId: (state) => (id) => {
    return state.all.filter(chunk => chunk.uploadId === id)
  }
}

const mutations = {
  [types.CHUNK_BEGIN] (state, attrs) {
    state.all.push({ ...attrs.chunk, done: false })
  },

  [types.CHUNK_DONE] (state, attrs) {
    state.all.find(chunk => chunk.id === attrs.chunk.id).done = true
  },

  [types.UPLOAD_CREATED] (state, attrs) {
    let chunks = state.all.filter(chunk => chunk.uploadId === attrs.upload.id)
    chunks.forEach((chunk) => {
      let i = state.all.indexOf(chunk)
      state.all.splice(i, 1)
    })
  }
}

export default {
  getters,
  state,
  mutations
}
