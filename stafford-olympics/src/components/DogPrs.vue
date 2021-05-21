<template>
  <v-container pa-0 ma-0>
    <v-card class="pt-4 pb-4" color="background lighten-2">
      <v-row>
        <v-col cols="4" class="pl-8"
          ><v-avatar>
            <v-img src="@/assets/default.jpg"></v-img>
          </v-avatar>
        </v-col>
        <v-col cols="8">
          <h3>
            {{ dog.name }}
          </h3>
          <p>
            <small>{{ dog.class }} "  <em class="ml-3">{{dog.retired ? "RETIRED" : ""}}</em></small> 
          </p>
        </v-col>
      </v-row>

      <v-list dense color="background lighten-2">
        <template v-for="(pr, index) in dog.prs">
          <v-list-item
            :key="`${index}-${pr.event.id}`"
            style="max-height: 25px; min-height: 25px"
            class="pr-2 pl-3"
          >
            <v-list-item-content class="pt-0 pb-0">
              <v-row no-gutters>
                <v-col cols="4"
                  ><small style="font-size: 0.7em;">{{ pr.event.name }}</small></v-col
                >
                <v-col cols="3" class="pr-1">
                  <small style="font-size: 0.7em;"
                    ><em>{{ pr.score || "--" }} {{pr.score?  pr.event.units : ""}}</em></small
                  ></v-col
                >
                 <v-col cols="5" class="pr-1">
                  <small style="font-size: 0.7em;"
                    ><em>{{ pr.when || "--" }}</em></small
                  ></v-col
                >
              </v-row>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon v-if="pr.star" :color="pr.star">mdi-star </v-icon>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
// import { mapGetters } from "vuex";

export default {
  data: () => ({}),
  methods: {},
  computed: {},
  props: {
    dog: Object,
  },
};
</script>

<style>
/* .v-overlay__scrim{
  opacity: 0.9 !important;
} */
.v-overlay--active {
  opacity: 0.9 !important;
}
</style>

