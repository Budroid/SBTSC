<template>
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
          v-bind:src="require('@/assets/' + currentTournament.country + '.png')"
        />
        <h2>{{ currentTournament.name }}</h2></v-col
      >
    </v-row>
    <v-row>
      <v-col sm="12" xs="12" md="6" lg="6" xl="4">
        <v-tabs v-model="tab" background-color="transparent" grow >
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
            <v-tabs-items v-model="inchClass" >
              <v-tab-item>
              <p>Once the tournament has started, the dog's scores can be submitted here. It is also no longer possible to register a team from then. So don't forget to do this in time.  </p> 
               </v-tab-item>
              <v-tab-item> Results 14" </v-tab-item>
              <v-tab-item> Results 15" </v-tab-item>
              <v-tab-item> Results 16" </v-tab-item>
              <v-tab-item> Results 17" </v-tab-item>
              <v-tab-item> Results 18" </v-tab-item>
            </v-tabs-items>
          </v-tab-item>
          <v-tab-item style="height: 75vh;">
            <teams />
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
    // currentTournament: {},
    inchClass: null,
    tab: null,
  }),
  created() {
    const currentTournament = this.tournaments.find(tournament => tournament.id === this.$route.params.id)
    // Geselecteerde tournament ophalen en in de store zetten, zodat de data beschikbaar is
    this.$store.dispatch("commitCurrentTournament", currentTournament).then(()=>{
      // Als dat klaar is, dan de bijbehoorende teams "lazy" laden.
      this.$store.dispatch("bindTeamsForTournament", currentTournament.id);
    });
    
    // Hier straks de listener opzetten voor de results van dit toernooi

    // Moeten we checken of het toernooi actief is? Zo niet dan is eenmalig ophalen voldoende
  },
  beforeDestroy() {
    // Listener voor de data van dit toernooi weer stoppen
    this.$store.dispatch("unbindTeamsForTournament");
  },
  computed: {
    ...mapGetters(["user", "tournaments", "currentTournament", "teamsForTournament"]),
  },
  components: { Teams },
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