<template>
  <v-container ma-0 pa-0>
    <v-card
      min-height="100vh"
      color="background lighten-1"
      class="pt-4 pb-4"
      v-if="!proccessing && user.permissionLevel > 1"
    >
      <v-card-text>
        <v-btn fixed text color="primary" right top @click="close()"
          ><v-icon>mdi-close</v-icon></v-btn
        >
        <v-expansion-panels class="mt-6">
          <v-expansion-panel
            v-for="(event, index) in dogResults"
            :key="`${index}-${event.id}`"
          >
            <v-expansion-panel-header :disable-icon-rotate="isDone(event)">
              <template v-if="isDone(event)" v-slot:actions>
                <v-icon color="teal">mdi-check</v-icon>
              </template>
              <template v-slot:default="{}">
                <v-row no-gutters>
                  <v-col cols="12"> {{ event.name }} </v-col>
                </v-row>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content dense color="background lighten-2">
              <v-container pt-9 v-if="submitting" style="text-align: center">
                <v-progress-circular :size="100" color="primary" indeterminate
                  >Submitting scores</v-progress-circular
                >
              </v-container>
              <v-list v-else dense color="background lighten-2">
                <template v-for="(score, index) in event.scores">
                  <v-list-item
                    dense
                    :key="`${index}-${score.dogId}`"
                    style="min-height: 25px"
                  >
                    <v-list-item-content class="pt-0 pb-0">
                      <!-- <v-container ma-0 pa-0 class="inputs-container"> -->
                      <v-row no-gutters>
                        <v-col
                          :cols="event.id === 6 ? 3 : 4"
                          align-self="center"
                        >
                          {{ score.dogName }}
                        </v-col>

                        <v-col
                          align-self="center"
                          :cols="event.id === 6 ? 3 : 5"
                        >
                          <v-text-field
                            class="crapremoved"
                            style="transform: scale(0.8)"
                            type="number"
                            rounded
                            filled
                            dense
                            :suffix="event.units"
                            v-model="score.score"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          v-if="event.id === 6"
                          cols="3"
                          align-self="center"
                          ><v-checkbox
                            class="crapremoved ma-0 pa-0"
                            dense
                            label="win"
                            v-model="score.win"
                          ></v-checkbox
                        ></v-col>

                        <v-col
                          cols="3"
                          align-self="center"
                          style="text-align: right; padding-right: 5px"
                          ><small v-show="score.score">
                            {{ score.points }} pts
                          </small></v-col
                        >
                      </v-row>
                      <!-- </v-container> -->

                      <!-- <v-list-item-title> -->

                      <!-- </v-list-item-title> -->
                    </v-list-item-content>
                    <v-list-item-action-text>
                      <v-icon
                        v-if="score.star && score.score"
                        size="20"
                        :color="score.star"
                        >mdi-star</v-icon
                      >
                      <v-icon v-else size="20" color="background lighten-2"
                        >mdi-star</v-icon
                      ></v-list-item-action-text
                    >
                  </v-list-item>
                </template>
              </v-list>
              <v-btn
                @click="submitScores(event)"
                class="pa-2 ma-3"
                right
                small
                color="primary"
                >{{ isDone(event) ? "Update" : "Submit" }} scores for
                {{ event.name }}</v-btn
              >
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { events } from "@/constants";
import { functions } from "@/firebase";

export default {
  data: () => ({
    proccessing: false,
    events: events,
    myDogs: [],
    submitting: false,
    originalResultList: [],
  }),
  beforeDestroy() {},
  created() {
    //  Deze is vet he: :P
    this.myDogs = this.teamsForTournament
      .filter((team) => team.creator == this.user.data.uid)
      .map((team) => team.dogs)
      .flat();
    this.originalResultList = [...this.resultsForTournament];
  },
  methods: {
    getDog(dogId) {
      return this.dogs.find((dog) => dog.id === dogId);
    },
    isPr(dogId, eventId, score) {
      const currentPr = this.getDog(dogId).prs[eventId]
      if (currentPr.score) {
        const descEvents = [1, 2, 3, 10];
        const ascEvents = [4, 5, 6, 7, 8, 9];
        if (descEvents.includes(eventId) && (score < currentPr.score)) {
          // Lager is beter
          return true;
        }
        if (ascEvents.includes(eventId) && (score > currentPr.score)) {
          // Hoger is beter
          return true;
        }
        // Geen PR helaas
        return false
      }
      // Nog geen PR bekend, dus score is PR
      return true
    },
    getScore(eventId, dogId) {
      const resultSet = this.resultsForTournament.find(
        (test) => test.dogId === dogId
      );
      let result = resultSet.results[eventId];
      result.eventId = eventId;
      result.ref = resultSet.id;
      return { ...result };
    },
    isDone(event) {
      return !event.scores.some((score) => !("star" in score));
    },
    submitScores(event) {
      this.submitting = true;
      // Checken welke waarden veranderd zijn, zodat niet alle scores steeds opnieuw gesubmit worden.
      let changes = [];
      event.scores.forEach((score) => {
        const remoteScore = this.getScore(score.eventId, score.dogId);

        const scoreUpdated =
          remoteScore.score !== score.score &&
          !(!remoteScore.score && !score.score);

        const winUpdated =
          remoteScore.win !== score.win &&
          !(
            typeof remoteScore.win === "undefined" &&
            typeof score.win === "undefined"
          );

        if (scoreUpdated || winUpdated) {
          changes.push(score);
        }
      });

      // Alleen submitten als er iets veranderd is
      if (changes.length) {
        // Object bakken dat we aan de firestore kunnen voeren
        let submission = {
          tournamentId: this.currentTournament.id,
          scores: changes.map((score) => ({
            ref: score.ref,
            dogId: score.dogId,
            eventId: score.eventId,
            score: score.score,
            win: score.win || false,
            class: score.class,
            height: score.height,
            pr: this.isPr(score.dogId, score.eventId, score.score),
            when: this.currentTournament.name
          })),
        };
    //  console.log(submission)
        const submit = functions.httpsCallable("submitScoresForEvent");
        submit(submission)
          .then(() => {
            this.submitting = false;
          })
          .catch((err) => {
            console.log(err.message);
            this.submitting = false;
          });
      } else {
        this.submitting = false;
      }
    },
    close() {
      this.$emit("onClose");
    },
  },
  computed: {
    ...mapGetters([
      "user",
      "teamsForTournament",
      "dogs",
      "resultsForTournament",
      "currentTournament",
    ]),
    dogResults() {
      // Structuur opbouwen om op het scherm te kunnen tonen
      return events.map((event) => {
        return {
          id: event.id,
          name: event.name,
          units: event.units,
          scores: this.myDogs.map((dog) => {
            let score = this.getScore(event.id, dog);
            let dogForResult = this.getDog(dog);
            score.class = dogForResult.class;
            score.height = dogForResult.height;
            score.dogName = dogForResult.name;
            score.dogId = dogForResult.id;
            score.dogImage = dogForResult.image;
            return score;
          }),
        };
      });
    },
  },
};
</script>

<style>
.v-expansion-panel-content__wrap {
  padding: 0px !important;
}

.crapremoved.v-input--dense > .v-input__control > .v-input__slot {
  margin: 0px;
  padding-right: 5px;
  padding-left: 8px;
}

.crapremoved.v-input--dense > .v-input__control > .v-text-field__details {
  display: none;
}

.crapremoved.v-input--dense > .v-input__control > .v-messages {
  display: none;
}
.v-application--is-ltr .v-input--selection-controls__input {
  margin-right: 1px;
}

.crapremoved.v-text-field--filled.v-input--dense.v-text-field--single-line
  > .v-input__control
  > .v-input__slot,
.v-text-field--filled.v-input--dense.v-text-field--outlined
  > .v-input__control
  > .v-input__slot,
.v-text-field--filled.v-input--dense.v-text-field--outlined.v-text-field--filled
  > .v-input__control
  > .v-input__slot,
.v-text-field--full-width.v-input--dense.v-text-field--single-line
  > .v-input__control
  > .v-input__slot,
.v-text-field--full-width.v-input--dense.v-text-field--outlined
  > .v-input__control
  > .v-input__slot,
.v-text-field--full-width.v-input--dense.v-text-field--outlined.v-text-field--filled
  > .v-input__control
  > .v-input__slot,
.v-text-field--outlined.v-input--dense.v-text-field--single-line
  > .v-input__control
  > .v-input__slot,
.v-text-field--outlined.v-input--dense.v-text-field--outlined
  > .v-input__control
  > .v-input__slot,
.v-text-field--outlined.v-input--dense.v-text-field--outlined.v-text-field--filled
  > .v-input__control
  > .v-input__slot {
  min-height: 20px;
}
</style>