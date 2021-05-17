<template>
  <v-fade-transition hide-on-leave>
    <v-container v-if="currentTournament && currentTournament.name">
      <v-row style="" no-gutters justify="center">
        <v-col
          style="text-align: center; margin-top: 10px"
          sm="12"
          xs="12"
          md="6"
          lg="6"
          xl="4"
        >
          <img
            width="100"
            v-bind:src="
              require('@/assets/' + currentTournament.country + '.png')
            "
          />
          <h2>{{ currentTournament.name }}</h2></v-col
        >
      </v-row>
      <v-row no-gutters justify="center">
        <v-col sm="12" xs="12" md="6" lg="6" xl="4">
          <v-tabs v-model="tab" background-color="transparent" grow>
            <v-tab>Results</v-tab>
            <v-tab>Teams</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <results />
            </v-tab-item>
            <v-tab-item>
              <teams />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>

      <v-layout column class="fab-container">
        <v-btn
          v-if="currentTournament.state.code === 'ofs'"
          @click="addTeamDialog = true"
          small
          color="primary"
          class="mb-2 mr-1"
        >
          Subscribe team
        </v-btn>

        <v-btn
          v-if="
            currentTournament.state.code === 'act' && user.permissionLevel > 1
          "
          @click="submitScoreDialog = true"
          small
          color="primary"
          class="mb-2 mr-1"
        >
          Submit scores
        </v-btn>

        <v-btn
          v-if="currentTournament.state.code === 'ofs'"
          small
          color="primary"
          class="mb-2 mr-1"
          @click="modifyStateDialog = true"
        >
          Start
        </v-btn>
        <v-btn
          v-else-if="currentTournament.state.code === 'act'"
          small
          color="primary"
          class="mb-2 mr-1"
          @click="modifyStateDialog = true"
        >
          Finish
        </v-btn>
      </v-layout>

      <!-- Subscribing team -->
      <v-dialog v-model="addTeamDialog">
        <subscribe-team v-if="addTeamDialog" @onClose="close()" />
      </v-dialog>
      <v-dialog v-model="modifyStateDialog" max-width="700">
        <!-- Starting tournament -->
        <v-card v-if="proccessing">
          <v-card-text class="text-center">
            <v-container pt-9>
              <v-progress-circular :size="100" color="primary" indeterminate
                >Proccessing</v-progress-circular
              >
            </v-container>
          </v-card-text>
        </v-card>

        <v-card
          color="background lighten-1"
          class="pt-4 pb-4"
          v-if="
            !proccessing &&
            currentTournament.state.code === 'ofs' &&
            user.permissionLevel == 3
          "
        >
          <v-card-text>
            <center><h3 style="margin-bottom: 5px">Are you sure?</h3></center>
            Have you cheched if all the teams are subscribed? After starting the
            tournament, this is no longer possible.
          </v-card-text>
          <v-card-actions
            ><v-btn @click="close()" small>Cancel</v-btn
            ><v-btn color="primary" small @click="start()"
              >Sure, lets go!</v-btn
            ></v-card-actions
          >
        </v-card>

        <!-- Finishing tournament -->
        <v-card
          color="background lighten-1"
          class="pt-4 pb-4"
          v-if="
            !proccessing &&
            currentTournament.state.code === 'act' &&
            user.permissionLevel == 3
          "
        >
          <v-card-text>
            <center>
              <h3 style="margin-bottom: 5px">
                Are you sure you want to finish this tournament?
              </h3>
              No more scores can be entered and the final results will be
              displayed
            </center>
          </v-card-text>
          <v-card-actions
            ><v-btn @click="close()" small>Cancel</v-btn
            ><v-btn color="primary" small @click="finish()"
              >Yep, it's done</v-btn
            ></v-card-actions
          >
        </v-card>
      </v-dialog>

      <v-dialog v-model="submitScoreDialog" max-width="600" :fullscreen="$vuetify.breakpoint.xsOnly" 
        ><submit-score v-if="submitScoreDialog" @onClose="close()"
      /></v-dialog>
    </v-container>
  </v-fade-transition>
</template>

<script>
import { mapGetters } from "vuex";
import { functions } from "@/firebase";
import Teams from "@/components/Teams.vue";
import Results from "@/components/Results.vue";
import SubscribeTeam from "@/components/SubscribeTeam.vue";
import SubmitScore from "@/components/SubmitScore.vue";
export default {
  data: () => ({
    tab: null,
    addTeamDialog: false,
    modifyStateDialog: false,
    submitScoreDialog: false,
    proccessing: false,
    err: "",
  }),
  created() {
    // Geselecteerde tournament, teams en scores ophalen en in de store zetten, zodat de data beschikbaar is
    this.$store.dispatch("bindTournamentById", this.$route.params.id);
    this.$store.dispatch("bindTeamsForTournament", this.$route.params.id);
    this.$store.dispatch("bindResultsForTournament", this.$route.params.id);
  },
  beforeDestroy() {
    // Listener voor de data van dit toernooi weer stoppen
    this.$store.dispatch("unbindTournament");
    this.$store.dispatch("unbindTeamsForTournament");
    this.$store.dispatch("unbindResultsForTournament");
  },
  methods: {
    start() {
      this.proccessing = true;
      const startTournament = functions.httpsCallable("startTournament");
      startTournament({
        tournamentId: this.currentTournament.id,
        dogs: this.dogsInTournament,
      })
        .then(() => {
          this.modifyStateDialog = false;
          this.proccessing = false;
          this.tab = 0;
        })
        .catch((err) => {
          console.log(err.message);
          this.err = err.message;
          this.proccessing = false;
          this.modifyStateDialog = false;
        });
    },
    finish() {
      this.proccessing = true;
      const finishTournament = functions.httpsCallable("finishTournament");
      finishTournament({
        tournamentId: this.currentTournament.id,
      })
        .then(() => {
          this.proccessing = false;
          this.modifyStateDialog = false;
        })
        .catch((err) => {
          this.err = err.message;
          this.modifyStateDialog = false;
          this.proccessing = false;
        });
    },
    close() {

      this.addTeamDialog = false;
      this.modifyStateDialog = false;
      this.submitScoreDialog = false;
    },
  },
  computed: {
    ...mapGetters([
      "user",
      "tournaments",
      "currentTournament",
      "teamsForTournament",
    ]),
    dogsInTournament() {
      return this.teamsForTournament
        ? this.teamsForTournament.map((team) => team.dogs).flat()
        : [];
    },
  },
  components: { Teams, SubscribeTeam, Results, SubmitScore },
};
</script>

<style>
.v-tab--active::before {
  opacity: 0 !important;
}

.theme--dark.v-tabs-items {
  background-color: #121212 !important;
}
.activeInnerTab .roundTab {
  background-color: #e42346 !important;
  color: white !important;
}
.roundTab {
  border-radius: 10%;
  height: 24px !important;
  width: 30px !important;
  line-height: 24px;
}

.innerTabs .v-tabs-slider {
  display: none;
}

.fab-container {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>