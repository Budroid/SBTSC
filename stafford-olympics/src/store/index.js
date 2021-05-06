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
    currentTournament:{},
    teamsForTournament: []
  },
  getters: {
    user(state) {
      return state.user
    },
    tournaments(state) {
      // Later even checken wanneer toernooien geupdate worden (active/inactive)
      return state.tournaments.sort((a, b) => b.startdate - a.startdate)
    },
    dogs(state) {
      return state.dogs
    },
    currentTournament(state) {
      return state.currentTournament
    },
    teamsForTournament(state) {
      return state.teamsForTournament
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setCurrentTournament(state, currentTournament) {
      state.currentTournament = currentTournament;
    },
    ...vuexfireMutations,
  },
  actions: {
    commitUser({ commit }, user) {
      commit("setUser", user);
    },
    commitCurrentTournament({ commit }, currentTournament) {
      commit("setCurrentTournament", currentTournament);
    },
    bindTeamsForTournament: firestoreAction(({bindFirestoreRef}, tournamentId) =>{
      return bindFirestoreRef('teamsForTournament', tournamentsCollection.doc(tournamentId).collection("teams"))
    }),
    bindTournaments: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('tournaments', tournamentsCollection)
    }),
    bindDogs: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('dogs', dogsCollection.orderBy('name'))
    }),
    unbindTeamsForTournament: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('teamsForTournament')
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