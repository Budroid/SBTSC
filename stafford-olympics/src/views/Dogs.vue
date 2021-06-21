<template>
  <v-fade-transition hide-on-leave>
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
                      placeholder="Search dog..."
                      type="text"
                      rounded
                      filled
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
            <template v-for="(dog, index) in filteredDogs">
              <v-list-item
                :key="`${index}-${dog.id}`"
                v-ripple="{ center: true }"
              >
                <v-list-item-avatar>
                  <!-- <v-avatar>
                    <v-img src="@/assets/default.jpg"></v-img>
                  </v-avatar> -->
                  <v-avatar v-if="dog.image">
                    <v-img :src="getImage(dog.image)"></v-img>
                  </v-avatar>
                  <v-avatar v-else>
                    <v-img src="@/assets/default.jpg"></v-img>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content @click="showPrs(dog)">
                  <v-list-item-title v-html="dog.name"></v-list-item-title>
                  <v-list-item-subtitle>
                    <div
                      style="
                        background-color: #393939;
                        border-radius: 25px;
                        height: 18px;
                        padding-left: 5px;
                      "
                    >
                      <v-icon
                        size="16"
                        v-for="(star, index) in getPrStars(dog.prs)"
                        :key="index"
                        :color="star"
                        >mdi-star</v-icon
                      >
                    </div>
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
      <v-dialog
        v-model="addDogDialog"
        @click:outside="close()"
        v-if="user && user.permissionLevel >= 2"
        max-width="600"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-if="user && user.permissionLevel > 1"
            style="z-index: 100; bottom: 72px"
            fab
            dark
            color="primary"
            fixed
            right
            bottom
            v-on="on"
          >
            <v-icon dark color="white">mdi-plus</v-icon>
          </v-btn>
        </template>
        <add-dog v-if="addDogDialog && !selectedDog" @onClose="close()" />
      </v-dialog>

      <v-dialog
        @click:outside="close()"
        v-model="updateDogDialog"
        v-if="user && user.permissionLevel >= 2"
        max-width="600"
      >
        <update-dog
          v-if="updateDogDialog && selectedDog"
          :selectedDog="selectedDog"
          @onClose="close()"
        />
      </v-dialog>

      <v-dialog v-model="showPrList" @click:outside="close()">
        <dog-prs v-if="showPrs" :dog="{ ...selectedDog }" />
      </v-dialog>
    </v-container>
  </v-fade-transition>
</template>
<script>
import AddDog from "../components/AddDog.vue";
import UpdateDog from "../components/UpdateDog.vue";
import DogPrs from "@/components/DogPrs.vue";
import { mapGetters } from "vuex";
import { getImageUrl } from "@/stringutil";

export default {
  components: { AddDog, UpdateDog, DogPrs },
  data: () => ({
    selectedDog: null,
    showPrList: false,
    // prsSelectedDog: [],
    addDogDialog: false,
    updateDogDialog: false,
    search: false,
    searchtext: "",
  }),
  methods: {
    getImage(url) {
      return getImageUrl(url, true);
    },
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
    getPrStars(prs) {
      return Object.values(prs)
        .map((pr) => pr.star)
        .filter((star) => star !== "");
    },
    updateDog(dog) {
      this.selectedDog = dog;
      this.updateDogDialog = true;
    },
    showPrs(dog) {
      this.selectedDog = dog;
      this.showPrList = true;
    },
    close() {
      this.selectedDog = null;
      this.updateDogDialog = false;
      this.addDogDialog = false;
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
        return { ...this.dogs };
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