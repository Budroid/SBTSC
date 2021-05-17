<template>
  <v-container ma-0 pa-0 fill-height style="height: 100vh !important">
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
      height="100vh"
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
            v-for="(event, index) in events"
            :key="`${index}-${event.id}`"
          >
            <v-expansion-panel-header>
              <template v-slot:default="{}">
                <v-row no-gutters>
                  <v-col cols="12"> {{ event.name }} </v-col>
                </v-row>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content dense>
              <v-list dense color="background lighten-2">
                <template v-for="(dog, index) in myDogs">
                  <v-list-item
                    dense
                    :key="`${index}-${dog}`"
                    style="min-height: 25px"
                  >
                    <v-list-item-content class="pt-0 pb-0">
                      <!-- <v-container ma-0 pa-0 class="inputs-container"> -->
                      <v-row no-gutters>
                        <v-col
                          :cols="event.id === 6 ? 3 : 4"
                          align-self="center"
                        >
                          {{ getDogName(dog.dogId) }}
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
                            :suffix="event.meta.units"
                            :value="dog.score"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          v-if="event.meta.id === 6"
                          cols="3"
                          align-self="center"
                          ><v-checkbox
                            class="crapremoved ma-0 pa-0"
                            dense
                            label="win"
                          ></v-checkbox
                        ></v-col>

                        <v-col
                          cols="3"
                          align-self="center"
                          style="text-align: right; padding-right: 5px"
                          ><small v-show="dog.score">
                            {{ dog.points }} pts
                          </small></v-col
                        >
                      </v-row>
                      <!-- </v-container> -->

                      <!-- <v-list-item-title> -->

                      <!-- </v-list-item-title> -->
                    </v-list-item-content>
                    <v-list-item-action-text>
                      <v-icon v-if="dog.score" size="20" color="grey"
                        >mdi-star</v-icon
                      >
                      <v-icon v-else size="20" color="background lighten-2"
                        >mdi-star</v-icon
                      ></v-list-item-action-text
                    >
                  </v-list-item>
                </template>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <!-- <v-card-actions
        ><v-btn small>Cancel</v-btn
        ><v-btn color="primary" small>Sure, lets go!</v-btn></v-card-actions
      > -->
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { events } from "@/constants";
export default {
  data: () => ({
    proccessing: false,
    events: events,
    myDogs: [],
  }),
  created() {
    //  Deze is vet he: :P
    this.myDogs = this.teamsForTournament
      .filter((team) => team.creator == this.user.data.uid)
      .map((team) => team.dogs)
      .flat();
  },
  methods: {
    getDogName(dogId) {
      return this.dogs.find((dog) => dog.id === dogId).name;
    },
    // isMyDog(dogId){
    //   return this.myDogs.some(dog => dog === dogId)
    // },
    // getResult(eventId, dogId) {
    //   return this.resultsForTournament
    //     .find((result) => result.dogId === dogId)
    //     .results.find((score) => score.eventId === eventId);
    // },
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
    ]),
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