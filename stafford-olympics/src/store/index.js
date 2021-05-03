import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { tournamentsCollection, dogsCollection, teamsCollection } from "@/firebase";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    tournaments: [],
    dogs: [],
    teams:[]
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
      // return state.dogs.sort((a, b) => a.name.localeCompare(b.name))
    },
    teams(state) {
      return state.teams
      // return state.dogs.sort((a, b) => a.name.localeCompare(b.name))
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
    bindTeamsByTournament: firestoreAction(({bindFirestoreRef}, tournamentId) =>{
      return bindFirestoreRef('teams', teamsCollection.where('tournament', '==', tournamentId))
    }),
    bindTournaments: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('tournaments', tournamentsCollection)
    }),
    bindDogs: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('dogs', dogsCollection.orderBy('name'))
    }),
    unbindTeams: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('teams')
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