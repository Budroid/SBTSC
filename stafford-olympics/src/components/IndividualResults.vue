<template>
<v-container pa-0 ma-0>
  <v-card class="pt-4 pb-4" color="background lighten-2">
   <center> <h3> {{getDog(allResultsForDog.dogId).name}} at {{currentTournament.name}}</h3></center>
    <v-list dense color="background lighten-2">
      <template v-for="(result, index) in allResultsForDog.results">
        <v-list-item  :key="`${index}-${result.id}`" style="min-height: 25px">
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title >{{
              getEventName(result.eventId)
            }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action-text>{{ result.score }}</v-list-item-action-text>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { events } from "@/constants"
export default {
  data: () => ({
    allResultsForDog: [],
  }),
  created() {
    this.allResultsForDog = this.resultsForTournament.find(
      (result) => result.dogId === this.dogId
    );
  },
  methods: {
    getEventName(eventId) {
      return events.find((event) => event.id === eventId).name;
    },
     getDog(dogId) {
      return this.dogs.find((dog) => dog.id === dogId);
    },
  },
  computed: {
    ...mapGetters(["resultsForTournament", "currentTournament", "dogs"]),
  },
  props: {
    dogId: String,
  },
};
</script>

<style>
/* .v-overlay__scrim{
  opacity: 0.9 !important;
} */
.v-overlay--active{
  opacity: 0.9 !important;
}
</style>

