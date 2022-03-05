import Vue from 'vue'
import Vuex from 'vuex'
//import firebase from "firebase";
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)


/*
firebase.auth().onAuthStateChanged(user => {
  if(user){
    this.store.commit('setCurrentUser', user)
  }
})

 */
export default new Vuex.Store({
  state: {
    currentUser: null
  },
  getters: {
    currentUser: state => state.currentUser

  },
  mutations: {
    SET_USER(state, user){
      if(user){
        state.currentUser = user
      }
      else state.currentUser = null
    },

    
  },
  actions: {
    setUser({ commit }, user){
      commit('SET_USER', user)
    },

  },
  modules: {
  },
  plugins: [createPersistedState()]
})
