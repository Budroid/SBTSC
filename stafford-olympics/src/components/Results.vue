<template>
  <v-container pb-12>
    <v-container v-if="currentTournament.state.code === 'ofs'" pl-9 pr-9 pt-9>
      <small
        ><em>
          Once the tournament has started, it is no longer possible to subscribe or
          change a team. Make sure all teams are final before the tournament
          start date. When the tournament has started, scores can be submitted
          on this page by teamcaptains and results will be displayed here.
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
      <v-tab-item> <team-list :results="allTeamResults" /> </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import ResultList from "@/components/ResultList.vue";
import TeamList from "@/components/TeamList.vue";
import { events } from "@/constants.js";
export default {
  data: () => ({
    inchClass: null,
  }),
  created() {},
  methods: {
    getDog(dogId) {
      return this.dogs.find((dog) => dog.id === dogId);
    },
    getResultsForClass(inchClass) {
      return this.overallResults.filter(
        (result) => result.dog.class === inchClass
      );
    },
    getResultForTeam(teamDogs) {
      let total = 0;
      // Per onderdeel de results van een team ophalen
      for (let event of events) {
        let resultsForTeamOnEvent = [];
        for (let dog of teamDogs) {
          // console.log(`dogid: ${dog} event: ${event.id}`);
          // Voor elke hond uit het team de score op het onderdeel ophalen.
          let score = this.getScore(event.id, dog);
          if (score) resultsForTeamOnEvent.push(score);
        }
        // Deze resultaten moeten nu gesorteerd worden op points
        resultsForTeamOnEvent.sort((a, b) => b.points - a.points);
        const totalForEvent = resultsForTeamOnEvent
          // En daarvan hebben we de top 4 (of minder) nodig
          .slice(0, 4)
          // En daarvan weer het totaal :)
          .reduce(
            (accumulator, currentValue) => accumulator + currentValue.points,
            0
          );
        total += totalForEvent;
      }
      return total;
    },
    getScore(eventId, dogId) {
      if (!this.resultsForTournament.length) return;
      const resultSet = this.resultsForTournament.find(
        (test) => test.dogId === dogId
      );
      let result = resultSet.results[eventId];
      result.eventId = eventId;
      return { ...result };
    },
  },
  components: { ResultList, TeamList },
  computed: {
    ...mapGetters([
      "currentTournament",
      "dogs",
      "resultsForTournament",
      "teamsForTournament",
    ]),
    allTeamResults() {
      return this.teamsForTournament.map((team) => ({
        id: team.id,
        name: team.name,
        total: this.getResultForTeam(team.dogs),
      }));
    },
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
          total: Object.values(result.results).reduce(
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