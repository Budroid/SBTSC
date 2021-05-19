<template>
  <v-container pa-0 ma-0>
    <v-card class="pt-4 pb-4" color="background lighten-2">
      <center>
        <h3>
          {{ getDogName(allResultsForDog.dogId) }} at
          {{ currentTournament.name }}
        </h3>
      </center>
      <v-list dense color="background lighten-2">
        <template v-for="(result, index) in allResultsForDog.results">
          <v-list-item
            :key="`${index}-${result.id}`"
            style="max-height: 25px; min-height: 25px"
          >
            <v-list-item-content class="pt-0 pb-0">
              <v-row no-gutters>
                <v-col cols="5"><small>{{ getEventName(index) }}</small></v-col>
                <v-col cols="2" class="pr-1" align="right">
                  <small>{{ result.score }}</small></v-col
                >
                <v-col cols="2"
                  ><small>{{ result.score ? getEventUnits(index) : "" }}</small>
                </v-col>

                <v-col cols="3">
                  <small>{{ result.win ? "Win: YES" : "" }}</small></v-col
                >
              </v-row>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon v-if="result.star" :color="result.star">mdi-star </v-icon>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { events } from "@/constants";
export default {
  data: () => ({
    allResultsForDog: [],
    events: events,
  }),
  created() {
    this.allResultsForDog = this.resultsForTournament.find(
      (result) => result.dogId === this.dogId
    );
  },
  methods: {
    getEventName(eventId) {
      return this.events.find((event) => event.id == eventId).name;
    },
    getEventUnits(eventId) {
      return this.events.find((event) => event.id == eventId).units;
    },
    getDogName(dogId) {
      return this.dogs.find((dog) => dog.id === dogId).name;
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
.v-overlay--active {
  opacity: 0.9 !important;
}
</style>

