import Vue from 'vue';
import Vuex from 'vuex';
// Decodificador de JWT
import decode from 'jwt-decode';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    userDB: null,
    page: localStorage.getItem('page') || 1,
  },
  mutations: {
    getUser(state, payload) {
      state.token = payload;
      payload === '' ? state.userDB = null : state.userDB = decode(payload);
    },
    savePage(state, payload) {
      state.page = payload;
    },
  },
  actions: {
    saveUser({ commit }, payload) {
      localStorage.setItem('token', payload);
      commit('getUser', payload);
    },
    signOut({ commit }) {
      localStorage.removeItem('token');
      commit('getUser', '');
      localStorage.removeItem('page');
      commit('savePage', 1);
    },
    checkToken({ commit, dispatch }) { // Reducir token a 1 min: agregar "- 59 * 60 * 1000"
      if(this.state.token && Date.now() < decode(this.state.token).exp * 1000) {
        commit('getUser', this.state.token);
        return true;
      };
      dispatch('signOut');
      return false;
    },
    setPage({ commit }, payload) {
      localStorage.setItem('page', payload);
      commit('savePage', payload);
    },
  },
  getters: {
    isActive: state => !!state.token,
  },
});

// VERIFICACION DE LA CADUCIADAD DEL TOKEN:
// https://stackoverflow.com/questions/51292406/jwt-check-if-token-expired#51293316