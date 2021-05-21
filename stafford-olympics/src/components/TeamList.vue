<template>
  <v-container pa-0 ma-0>
    <v-list>
      <template v-for="(result, index) in orderedResults">
        <v-list-item
        v-ripple="{ center: true }"
          :key="`${index}-${result.id}`"
         
        >
          <v-list-item-content>
            <v-list-item-title>{{ result.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action-text>{{ result.total }} pts</v-list-item-action-text>
        </v-list-item>
      </template>
    </v-list>
  </v-container>
</template>

<script>
export default {
  props: {
    results: Array,
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