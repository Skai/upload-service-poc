import * as types from './../mutation-types'

const state = {
  all: []
}

const getters = {
  chunksByUploadId: (state) => (id) => {
    let chunks = state.all.filter(chunk => chunk.uploadId === id)
    chunks.sort((a, b) => {
      if (a.start < b.start) return -1
      if (a.start > b.start) return 1
      return 0
    })
    return chunks
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
