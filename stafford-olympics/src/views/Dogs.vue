<template>
  <v-container
    :ma-0="$vuetify.breakpoint.mdAndDown"
    :pa-0="$vuetify.breakpoint.mdAndDown"
  >
    <v-row justify="center">
      <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
        <v-list>
          <v-subheader style="height: 20px">Dogs</v-subheader>
          <template v-for="dog in dogs">
            <v-list-item :key="dog.id">
              <v-list-item-avatar>
                <v-avatar v-if="dog.image" size="60px">
                  <v-img :src="dog.image"></v-img>
                </v-avatar>
                <v-avatar v-else size="60px">
                  <v-img src="@/assets/default.jpg"></v-img>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="dog.name"></v-list-item-title>
                <v-list-item-subtitle> [stars] </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-bind:key="dog.id" />
          </template>
        </v-list>
      </v-col>
    </v-row>
    <!-- Create dog dialog -->
    <v-dialog v-model="createDialog" v-if="user.permissionLevel >= 2">
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
      <add-dog @onClose="createDialog = false" />
    </v-dialog>
  </v-container>
</template>
<script>
import { dogsCollection } from "@/firebase";
import AddDog from "../components/AddDog.vue";
import { mapGetters } from "vuex";
export default {
  components: { AddDog },
  data: () => ({
    createDialog: false,
    dogs: [],
    unsubscribe: {},
  }),
  created() {
    const dogsRef = dogsCollection.orderBy("name");
    this.unsubscribe = dogsRef.onSnapshot((ref) => {
      ref.docChanges().forEach((change) => {
        const { newIndex, oldIndex, doc, type } = change;
        if (type === "added") {
          this.dogs.splice(newIndex, 0, doc.data());
        } else if (type === "modified") {
          this.dogs.splice(oldIndex, 1);
          this.dogs.splice(newIndex, 0, doc.data());
        } else if (type === "removed") {
          this.dogs.splice(oldIndex, 1);
        }
      });
    });
  },
  beforeDestroy() {
    // We willen geen updates meer ontvangen wanneer we niet op het betreffende scherm aanwezig zijn.
    // Wanneer er weer wordt teruggekeerd naar de tournaments ontvangen we de meest recente snapshot. Dit voorkomt onnodig gebruik van bandbreedte
    this.unsubscribe();
  },
  methods: {},
  computed: {
    ...mapGetters(["user"]),
  },
};
</script>
<style>
</style>