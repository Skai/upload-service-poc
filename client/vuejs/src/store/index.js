import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import chunks from './modules/chunks'
import uploads from './modules/uploads'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  modules: {
    chunks,
    uploads
  }
})
