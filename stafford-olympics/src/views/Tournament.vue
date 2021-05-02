<template>
  <v-container>
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
          v-bind:src="require('@/assets/' + currentTournament.country + '.png')"
        />
        <h2>{{ currentTournament.name }}</h2></v-col
      >
    </v-row>
    <v-row>
      <v-col sm="12" xs="12" md="6" lg="6" xl="4">
        <v-tabs v-model="tab" background-color="transparent" grow>
          <v-tab>Results</v-tab>
          <v-tab>Teams</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-tabs
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
              <v-tab-item> Overall results </v-tab-item>
              <v-tab-item> Results 14" </v-tab-item>
              <v-tab-item> Results 15" </v-tab-item>
              <v-tab-item> Results 16" </v-tab-item>
              <v-tab-item> Results 17" </v-tab-item>
              <v-tab-item> Results 18" </v-tab-item>
            </v-tabs-items>
          </v-tab-item>
          <v-tab-item>
             <teams :currentTournament='currentTournament' />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import Teams from '@/components/Teams.vue'
export default {
  data: () => ({
    currentTournament: {},
    inchClass: null,
    tab: null,
  }),
  created() {
    // Scherm voorzien van data
    this.currentTournament = this.tournaments.find(
      (tournament) => tournament.id === this.$route.params.id
    );
    // Hier straks de listener opzetten voor de results van dit toernooi

    // Moeten we checken of het toernooi actief is? Zo niet dan is eenmalig ophalen voldoende
  },
  beforeDestroy() {
    // Listener voor de results van dit toernooi weer stoppen
  },
  computed: {
    ...mapGetters(["user", "tournaments"]),
  },
  components:{Teams}
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
</style>