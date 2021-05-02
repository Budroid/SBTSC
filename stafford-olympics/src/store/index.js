import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { tournamentsCollection, dogsCollection } from "@/firebase";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    tournaments: [],
    dogs: [],
  },
  getters: {
    user(state) {
      return state.user
    },
    tournaments(state) {
      return state.tournaments.sort((a, b) => b.startdate - a.startdate)
    },
    dogs(state) {
      return state.dogs.sort((a, b) => a.name.localeCompare(b.name))
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    ...vuexfireMutations,
  },
  actions: {
    commitUser({ commit }, user) {
      commit("setUser", user);
    },
    bindTournaments: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('tournaments', tournamentsCollection)
    }),
    bindDogs: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('dogs', dogsCollection)
    }),
    unbindTournaments: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('tournaments')
    }),
    unbindDogs: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('dogs')
    }),
  },
  modules: {
  }
})
export default store