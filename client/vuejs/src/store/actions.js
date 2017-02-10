import * as types from './mutation-types'

const actions = {
  newUpload ({commit}, attrs) {
    commit(types.NEW_UPLOAD, {
      upload: attrs.upload
    })
  },

  beginChunk ({commit}, attrs) {
    commit(types.CHUNK_BEGIN, {
      chunk: attrs.chunk
    })
  },

  doneChunk ({commit}, attrs) {
    commit(types.CHUNK_DONE, {
      chunk: attrs.chunk
    })
  },

  uploadCreated ({commit}, attrs) {
    commit(types.UPLOAD_CREATED, {
      upload: attrs.upload
    })
  }
}

export { actions as default }
