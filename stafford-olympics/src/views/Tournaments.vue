<template>
<v-fade-transition hide-on-leave>
  <v-container
    :ma-0="$vuetify.breakpoint.mdAndDown"
    :pa-0="$vuetify.breakpoint.mdAndDown"
  >
    <v-row justify="center">
      <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
        <v-list>
          <v-subheader style="height: 20px">Tournaments</v-subheader>
          <template v-for="tournament, index in tournaments">
            <v-list-item
            v-ripple="{ center: true }"
              :key="`${index}-${tournament.id}`"
              :to="'/tournament/' + tournament.id"
            >
              <v-list-item-avatar tile>
                <img
                  v-bind:src="
                    require('@/assets/' + tournament.country + '.png')
                  "
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ tournament.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  <small
                    >Start date:
                    {{
                      tournament.startdate.toDate().toLocaleDateString()
                    }}</small
                  >
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action
                ><small>
                  <em
                    v-if="tournament.state.code === 'act'"
                    class="green--text text--lighten-2"
                    >{{ tournament.state.text }}</em
                  >
                  <em
                    v-if="tournament.state.code === 'ofs'"
                    class="grey--text text--lighten-2"
                    >{{ tournament.state.text }}</em
                  >
                  <em
                    v-if="tournament.state.code === 'fin'"
                    class="red--text text--lighten-2"
                    >{{ tournament.state.text }}</em
                  >
                </small></v-list-item-action
              >
            </v-list-item>
            <v-divider v-bind:key="tournament.id" />
          </template>
        </v-list>
      </v-col>
    </v-row>
    <!-- Create tournament dialog -->
    <v-dialog v-model="createDialog" v-if="user && user.permissionLevel == 3" max-width="900">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          style="z-index: 100; bottom: 72px"
          fab
          dark
          color="primary"
          fixed
          right
          bottom
          v-bind="attrs"
          v-on="on"
        >
          <v-icon dark color="white">mdi-plus</v-icon>
        </v-btn>
      </template>
      <add-tournament
        @onCancel="createDialog = false"
        @onSuccess="createDialog = false"
      />
    </v-dialog>
  </v-container>
</v-fade-transition>
</template>
<script>
import AddTournament from "../components/AddTournament.vue";
import { mapGetters } from "vuex";

export default {
  components: { AddTournament },
  data: () => ({
    createDialog: false,
    successDialog: false,
  }),
  methods: {},
  computed: {
    ...mapGetters(["user", "tournaments"]),
  },
};
</script>
<style>
</style>