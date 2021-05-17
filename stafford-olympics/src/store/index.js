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
    teamsForTournament: [],
    resultsForTournament:[]
  },
  getters: {
    user(state) {
      return state.user
    },
    tournaments(state) {
      return state.tournaments
    },
    dogs(state) {
      return state.dogs
    },
    currentTournament(state) {
      return state.currentTournament
    },
    teamsForTournament(state) {
      return state.teamsForTournament
    },
    resultsForTournament(state){
      return state.resultsForTournament
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    // setCurrentTournament(state, currentTournament) {
    //   state.currentTournament = currentTournament;
    // },
    ...vuexfireMutations,
  },
  actions: {
    commitUser({ commit }, user) {
      commit("setUser", user);
    },
    // commitCurrentTournament({ commit }, currentTournament) {
    //   commit("setCurrentTournament", currentTournament);
    // },
    bindTournamentById: firestoreAction(({bindFirestoreRef}, tournamentId) =>{
      return bindFirestoreRef('currentTournament', tournamentsCollection.doc(tournamentId))
    }),
   
    bindTeamsForTournament: firestoreAction(({bindFirestoreRef}, tournamentId) =>{
      return bindFirestoreRef('teamsForTournament', tournamentsCollection.doc(tournamentId).collection("teams"))
    }),
    bindResultsForTournament: firestoreAction(({bindFirestoreRef}, tournamentId) =>{
      return bindFirestoreRef('resultsForTournament', tournamentsCollection.doc(tournamentId).collection("results"))
    }),
    bindTournaments: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('tournaments', tournamentsCollection.orderBy('startdate', 'desc'))
    }),
    bindDogs: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('dogs', dogsCollection.orderBy('name'))
    }),
    unbindTeamsForTournament: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('teamsForTournament')
    }),
    unbindResultsForTournament: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('resultsForTournament')
    }),
    unbindTournament: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('currentTournament')
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