<template>
  <v-container>
    <v-list>
      <v-subheader style="height: 20px; padding-bottom: 5px"
        >My teams</v-subheader
      >
      <template v-if="myTeams.length">
        <v-list-item :key="team.id" v-for="team in myTeams">
          <v-list-item-content class="pb-0 pt-0">
            <v-list-item-title style="text-align: center; margin-top: 8px"
              ><em>{{ team.name }}</em
              ><v-icon
                @click="showUpdateDialog(team)"
                style="padding-left: 10px"
                >mdi-pencil</v-icon
              ></v-list-item-title
            >

            <v-container pa-0 ma-0 pt-2 style="border-bottom: 1pt solid red">
              <v-row no-gutters justify="center">
                <v-col
                  cols="2"
                  justify="center"
                  v-for="dog in dogsForTeam(team.dogs)"
                  v-bind:key="dog.id"
                  style="margin: 0px; padding: 0px; overflow: hidden"
                >
                  <v-list-item-avatar
                    size="30"
                    class="ma-0 mb-1"
                    style="
                      display: block !important;
                      margin-left: auto !important;
                      margin-right: auto !important;
                    "
                  >
                    <v-img src="@/assets/default.jpg"></v-img>
                  </v-list-item-avatar>

                  <p
                    style="
                      text-align: center !important;
                      font-size: 10px;
                      margin-bottom: 8px;
                    "
                  >
                    {{ dog.name }}
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-else
        ><v-container
          ><small
            >You haven't subscribed a team for
            {{ currentTournament.name }} yet.</small
          ></v-container
        ></template
      >
    </v-list>
    <v-list>
      <v-subheader style="height: 20px">Other teams</v-subheader>
      <template v-if="otherTeams.length">
        <v-list-item :key="team.id" v-for="team in otherTeams">
          <v-list-item-content class="pb-0 pt-0">
            <v-list-item-title style="text-align: center; margin-top: 8px"
              ><em>{{ team.name }}</em></v-list-item-title
            >

            <v-container pa-0 ma-0 pt-2 style="border-bottom: 1pt solid red">
              <v-row no-gutters justify="center">
                <v-col
                  cols="2"
                  justify="center"
                  v-for="dog in dogsForTeam(team.dogs)"
                  v-bind:key="dog.id"
                  style="margin: 0px; padding: 0px; overflow: hidden"
                >
                  <v-list-item-avatar
                    size="30"
                    class="ma-0 mb-1"
                    style="
                      display: block !important;
                      margin-left: auto !important;
                      margin-right: auto !important;
                    "
                  >
                    <v-img src="@/assets/default.jpg"></v-img>
                  </v-list-item-avatar>

                  <p
                    style="
                      text-align: center !important;
                      font-size: 10px;
                      margin-bottom: 8px;
                    "
                  >
                    {{ dog.name }}
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-else
        ><v-container
          ><small
            >No other team for {{ currentTournament.name }} yet.</small
          ></v-container
        ></template
      >
    </v-list>

    <v-btn
      @click="addTeamDialog = true"
      small
      color="primary"
      fixed
      right
      bottom
      >Subscribe team</v-btn
    >

    <!-- Add team dialog -->
    <v-dialog v-model="addTeamDialog">
      <subscribe-team v-if="addTeamDialog" @onClose="close()" />
    </v-dialog>
    <!-- Change team dialog -->
    <v-dialog v-model="changeTeamDialog">
      <change-team
        v-if="changeTeamDialog"
        :teamToUpdate="teamToUpdate"
        @onClose="close()"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import SubscribeTeam from "@/components/SubscribeTeam.vue";
import ChangeTeam from "@/components/ChangeTeam.vue";
import { mapGetters } from "vuex";
export default {
  data: () => ({
    addTeamDialog: false,
    changeTeamDialog: false,
    teamToUpdate: {},
  }),
  created() {},
  methods: {
    dogsForTeam(ids) {
      return this.dogs.filter(({ id }) => ids.includes(id));
    },
    showUpdateDialog(team) {
      this.teamToUpdate = team;
      this.changeTeamDialog = true;
    },
    close() {
      this.addTeamDialog = false;
      this.changeTeamDialog = false;
    },
  },
  components: {
    SubscribeTeam,
    ChangeTeam,
  },
  computed: {
    ...mapGetters(["currentTournament", "user", "dogs", "teamsForTournament"]),
    myTeams() {
      // De fillter methode van JavaScript heeft hier geen zin, aangezien er dan een kopie van de array
      // wordt gemaakt. ID is non-iterable, dus die zijn we dan kwijt. Daarom deze ouderwedse "for-loop". Is nog sneller ook. Lol.
      let myTeams = [];
      for (let i = 0; i < this.teamsForTournament.length; i++) {
        if (this.teamsForTournament[i].creator === this.user.data.uid) {
          myTeams.push(this.teamsForTournament[i]);
        }
      }
      return myTeams;
    },
    otherTeams() {
      // Zelfde verhaal hier. Je vraagt je wellicht af waarom dit niet gecombineerd kan worden met de
      // vorige. Dat is omdat myTeam en otherTeams observable moeten blijven. En dus beiden een eigen functie hebben.
      let otherTeams = [];
      for (let i = 0; i < this.teamsForTournament.length; i++) {
        if (this.teamsForTournament[i].creator !== this.user.data.uid) {
          otherTeams.push(this.teamsForTournament[i]);
        }
      }
      return otherTeams;
    },
  },
};
</script>

<style>
</style>