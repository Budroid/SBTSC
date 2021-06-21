<template>
  <v-container pa-0 ma-0>
    <v-list>
      <template v-for="(result, index) in orderedResults">
        <v-list-item
          v-ripple="{ center: true }"
          :key="`${index}-${result.dog.id}`"
          @click.native="showDetals(result.dog.id)"
        >
          <v-list-item-avatar>
            <v-avatar>
              <v-img v-if="result.dog.image" :src="getImage(result.dog.image)"></v-img>
              <v-img v-else src="@/assets/default.jpg"></v-img>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ result.dog.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action-text
            >{{ result.total }} pts</v-list-item-action-text
          >
        </v-list-item>
      </template>
    </v-list>
    <v-dialog v-model="detailDialog" max-width="600">
      <individual-results v-if="detailDialog" :dogId="selectedDogId" />
    </v-dialog>
  </v-container>
</template>

<script>
import IndividualResults from "@/components/IndividualResults";
import { getImageUrl } from "@/stringutil";
export default {
  data: () => ({
    detailDialog: false,
    selectedDogId: null,
  }),
  props: {
    results: Array,
  },
  components: {
    IndividualResults,
  },
  methods: {
    getImage(url) {
      return getImageUrl(url, true);
    },
    showDetals(dogId) {
      this.selectedDogId = dogId;
      this.detailDialog = true;
    },
  },
  computed: {
    orderedResults() {
      let copy = [...this.results];
      return copy.sort((a, b) => b.total - a.total);
    },
  },
};
</script>

<style>
</style>