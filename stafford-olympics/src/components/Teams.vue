<template>
  <v-container>
    <v-list>
      <v-subheader style="height: 20px">My teams</v-subheader>
      <template v-if="myTeams.length">
        <v-list-item :key="team.id" v-for="team in myTeams">
          <v-list-item-content>
            <v-list-item-title>Team X</v-list-item-title>
          </v-list-item-content>
          <v-divider v-bind:key="team.id" />
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
          <v-list-item-content>
            <v-list-item-title>Team X</v-list-item-title>
          </v-list-item-content>
          <v-divider v-bind:key="team.id" />
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
    <v-dialog v-model="addTeamDialog" style="height: 100vh;">
      <subscribe-team v-if="addTeamDialog" @onClose="close()" />
    </v-dialog>
  </v-container>
</template>

<script>
import SubscribeTeam from "@/components/SubscribeTeam.vue";
export default {
  data: () => ({
    myTeams: [],
    otherTeams: [],
    addTeamDialog: false,
  }),
  methods: {
    close() {
      this.addTeamDialog = false;
    },
  },
  props: {
    currentTournament: Object,
  },
  components: {
    SubscribeTeam,
  },
};
</script>

<style>
</style>