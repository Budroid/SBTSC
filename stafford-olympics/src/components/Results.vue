<template>
  <v-container>
    <v-container v-if="currentTournament.state.code === 'ofs'" pl-9 pr-9 pt-9>
      <small
        ><em>
          Once the tournament has started, the dog's scores can be submitted and
          the results will be visible here. It is not possible to subscribe or
          change a team after the tournament has been started. So don't forget
          to do this in time.
          <br /><br />Happy competition!
        </em></small
      >
    </v-container>
    <v-tabs
      v-else
      class="innerTabs"
      v-model="inchClass"
      background-color="transparent"
      grow
      active-class="activeInnerTab"
    >
      <v-tab>
        <div class="roundTab">All</div>
      </v-tab>

      <v-tab><div class="roundTab">14"</div></v-tab>
      <v-tab><div class="roundTab">15"</div></v-tab>
      <v-tab><div class="roundTab">16"</div></v-tab>
      <v-tab><div class="roundTab">17"</div></v-tab>
      <v-tab><div class="roundTab">18"</div></v-tab>
      <v-tab><div class="roundTab">Tms</div></v-tab>
    </v-tabs>
    <v-tabs-items v-model="inchClass">
      <v-tab-item> <result-list :results="overallResults" /> </v-tab-item>
      <v-tab-item>
        <result-list :results="getResultsForClass(14)" />
      </v-tab-item>
      <v-tab-item>
        <result-list :results="getResultsForClass(15)" />
      </v-tab-item>
      <v-tab-item>
        <result-list :results="getResultsForClass(16)" />
      </v-tab-item>
      <v-tab-item>
        <result-list :results="getResultsForClass(17)" />
      </v-tab-item>
      <v-tab-item>
        <result-list :results="getResultsForClass(18)" />
      </v-tab-item>
      <v-tab-item> Teamresults. Not implemented yet </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import ResultList from "@/components/ResultList.vue";
export default {
  data: () => ({
    inchClass: null,
  }),
  created() {
  
  },
  methods: {
    getDog(dogId) {
      return this.dogs.find((dog) => dog.id === dogId);
    },
    getResultsForClass(inchClass) {
      return this.overallResults.filter(
        (result) => result.dog.class === inchClass
      );
    },
  },
  components: { ResultList },
  computed: {
    ...mapGetters([
      "currentTournament",
      "dogs",
      "resultsForTournament",
      "teamsForTournament",
    ]),
    // dogsInTournament() {
    //   return this.teamsForTournament
    //     ? this.teamsForTournament.map((team) => team.dogs).flat()
    //     : [];
    // },
    overallResults() {
      // // Alle resulaten voor dit tournament
      // const allResults = this.resultsForTournament
      //   .map((event) => event.dogs)
      //   .flat();

      // return this.dogsInTournament.map((dog) => {
      //   let resultsForDog = allResults.filter((result) => result.dogId === dog);
      //   let totalForDog = resultsForDog.reduce(
      //     (accumulator, currentValue) =>
      //       accumulator + (currentValue.points || 0),
      //     0
      //   );
      //   return {
      //     dog: this.getDog(dog),
      //     total: totalForDog,
      //   };
      // });

      return this.resultsForTournament.map((result) => {
        return {
          dog: this.getDog(result.dogId),
          total: result.results.reduce(
            (accumulator, currentValue) => accumulator + currentValue.points,
            0
          ),
        };
      });
    },
  },
};
</script>

<style>
</style>