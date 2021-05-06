<template>
  <v-container
    :ma-0="$vuetify.breakpoint.mdAndDown"
    :pa-0="$vuetify.breakpoint.mdAndDown"
  >
    <v-row justify="center">
      <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
        <v-list>
          <v-subheader style="height: 20px">Dogs</v-subheader>
          <v-expand-transition>
            <div v-show="search" justify="center">
              <v-row style="height: 40px" justify="center" class="pa-0 ma-0">
                <v-col
                  cols="10"
                  xs="10"
                  sm="10"
                  md="8"
                  lg="8"
                  xl="8"
                  class="pa-0 ma-0"
                >
                  <v-text-field
                    style="margin: 0px"
                    ref="search"
                    v-model="searchtext"
                    placeholder="Start typing to find your dog..."
                    type="text"
                    rounded
                    filled
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
          <template v-for="dog, index in filteredDogs">
            <v-list-item :key="`${index}-${dog.id}`">
              <v-list-item-avatar>
                <v-avatar>
                  <v-img src="@/assets/default.jpg"></v-img>
                </v-avatar>
                <!-- <v-avatar v-if="dog.image">
                  <v-img :src="dog.image"></v-img>
                </v-avatar>
                <v-avatar v-else>
                  <v-img src="@/assets/default.jpg"></v-img>
                </v-avatar> -->
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="dog.name"></v-list-item-title>
                <v-list-item-subtitle>
                  <v-icon
                    size="16"
                    color="grey"
                    v-for="index in 10"
                    :key="index"
                    >mdi-star</v-icon
                  >
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon v-if="dog.creator == user.data.uid">
                <v-icon @click="updateDog(dog)">mdi-pencil</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-divider v-bind:key="dog.id" />
          </template>
        </v-list>
        <div style="height: 230px"></div>
      </v-col>
    </v-row>
    <v-btn
      fab
      style="bottom: 136px"
      dark
      color="primary"
      fixed
      right
      bottom
      @click="toggleSearch()"
      ><v-icon dark color="white">mdi-magnify</v-icon>
    </v-btn>
    <!-- Create dog dialog -->
    <v-dialog v-model="dogDialog" v-if="user && user.permissionLevel >= 2">
      <template v-slot:activator="{  }">
        <v-btn
          style="z-index: 100; bottom: 72px"
          fab
          dark
          color="primary"
          fixed
          right
          bottom
   
        >
          <v-icon dark color="white">mdi-plus</v-icon>
        </v-btn>
      </template>
      <add-dog v-if="dogDialog && !selectedDog" @onClose="close()" />
      <update-dog
        v-if="dogDialog && selectedDog"
        :selectedDog="selectedDog"
        @onClose="close()"
      />
    </v-dialog>
  </v-container>
</template>
<script>
import AddDog from "../components/AddDog.vue";
import UpdateDog from "../components/UpdateDog.vue";
import { mapGetters } from "vuex";

export default {
  components: { AddDog, UpdateDog },
  data: () => ({
    selectedDog: false,
    dogDialog: false,
    search: false,
    searchtext: "",
  }),
  methods: {
    toggleSearch() {
      if (this.search) {
        this.searchtext = "";
      } else {
        setTimeout(() => {
          this.$refs.search.focus();
        }, 100);
      }
      this.search = !this.search;
    },
    updateDog(dog) {
      this.selectedDog = dog;
      this.dogDialog = true;
    },
    close() {
      this.selectedDog = false;
      this.dogDialog = false;
    },
  },
  computed: {
    ...mapGetters(["user", "dogs"]),
    filteredDogs() {
      if (this.searchtext) {
        return this.dogs.filter((dog) => {
          return dog.name
            .toLowerCase()
            .startsWith(this.searchtext.toLowerCase());
        });
      } else {
        return {...this.dogs};
      }
    },
  },
};
</script>
<style scoped>
.v-text-field__details {
  display: none;
}
</style>