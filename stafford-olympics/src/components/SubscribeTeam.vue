<template>
  <v-container>
    <v-card flat class="mb-0" color="background lighten-1">
      <v-container v-if="creating" fill-height>
        <v-row class="text-center" justify="center" align="center">
          <v-col cols="12" xs="12" sm="12" md="6">
            <v-progress-circular :size="100" color="primary" indeterminate
              >Proccessing</v-progress-circular
            >
          </v-col>
        </v-row>
      </v-container>

      <v-container v-else-if="created" fill-height>
        <v-row class="text-center" justify="center" align="center">
          <v-col cols="12" xs="12" sm="12" md="6">
            <h2>{{ teamName }}</h2>
            <p>has been succesfully subscribed</p>
            <v-btn @click="$emit('onClose')" color="primary"> DONE </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-else>
        <v-form v-model="valid" @keyup.native.enter="valid && createTeam()">
          <v-text-field
            v-model.trim="teamName"
            :rules="teamNameRules"
            prepend-icon="mdi-account-multiple"
            label="Teamname"
            required
            hide-details="auto"
            maxlength="30"
          ></v-text-field>
        </v-form>
        <small>Select dogs for your team:</small>

        <v-row no-gutters>
          <v-col cols="6"
            ><small>Available ({{ availableDogs.length }})</small>
            <v-list
              dense
              color="background lighten-2"
              style="height: 30vh; overflow: scroll"
            >
              <template v-for="(dog, index) in availableDogs">
                <v-list-item
                  :key="dog.id"
                  @click="select(dog.id, index)"
                  class="pl-1 pr-2 pb-1"
                >
                  <v-list-item-avatar size="25" class="mr-1 mt-0 mb-0">
                    <v-img src="@/assets/default.jpg"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content class="ma-0 pa-0">
                    <small>{{ dog.name }}</small>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list> </v-col
          ><v-col cols="6"
            ><small>Selected ({{ selectedDogs.length }}/6)</small>
            <v-list
              dense
              color="background lighten-2"
              style="height: 30vh; overflow: scroll"
            >
              <template v-for="(dog, index) in selectedDogs">
                <v-list-item
                  :key="dog.id"
                  @click="deselect(dog.id, index)"
                  class="pl-1 pr-2 pb-1"
                >
                  <v-list-item-avatar size="25" class="mr-1 mt-0 mb-0">
                    <v-img src="@/assets/default.jpg"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content class="ma-0 pa-0">
                    <small>{{ dog.name }}</small>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
        <v-row v-if="err">
          <v-col>
            <v-alert
              style="border: 1pt solid red !important"
              dense
              color="#360f0f"
              rounded="pill"
              type="error"
            >
              <small>{{ err }}</small>
            </v-alert>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            ><v-btn class="mr-2" small @click="$emit('onClose')">Cancel</v-btn
            ><v-btn
              @click="createTeam()"
              small
              color="primary"
              :disabled="!valid || !selectedDogs.length"
              >Subscribe</v-btn
            ></v-col
          >
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import {  mapGetters } from "vuex";
// import { mapGetters, mapState } from "vuex";
import { teamNameRules } from "@/validationrules";
import { functions } from "@/firebase";
export default {
  name: "SubscribeTeam",
  data: () => ({
    teamName: "",
    availableDogs: [],
    selectedDogs: [],
    teamNameRules: teamNameRules,
    // teamNameRules: [v => !!v || 'What\'s the name for this team?'],
    valid: false,
    creating: false,
    created: false,
    err: "",
  }),

  created() {
   this.availableDogs = this.dogs.filter(
      (dog) => !dog.retired && dog.availableForTeam
    );
  },
  components: {},
  methods: {
    select(dogId, index) {
      // Max 6 honden in een team
      if (this.selectedDogs.length == 6) {
        return;
      }
      this.selectedDogs.push(
        this.availableDogs.find((dog) => dog.id === dogId)
      );
      this.selectedDogs.sort((a, b) => a.name.localeCompare(b.name));
      this.availableDogs.splice(index, 1);
    },
    deselect(dogId, index) {
      this.availableDogs.push(
        this.selectedDogs.find((dog) => dog.id === dogId)
      );
      this.availableDogs.sort((a, b) => a.name.localeCompare(b.name));
      this.selectedDogs.splice(index, 1);
    },
    createTeam() {
      this.creating = true;
      let team = {
        name: this.teamName,
        dogs: this.selectedDogs.map((dog) => dog.id),
        tournament: this.$route.params.id,
      };
      const subscribeTeam = functions.httpsCallable("subscribeTeam");
      subscribeTeam({
        team: team,
      })
        .then(() => {
          this.creating = false;
          this.created = true;
        })
        .catch((err) => {
          this.err = err;
          this.creating = false;
          this.created = false;
        });
    },
  },
  computed: {
    ...mapGetters(["dogs"]),
  },
};
</script>
<style scoped>
.v-list--dense .v-list-item {
  min-height: 0px !important;
}
</style>
