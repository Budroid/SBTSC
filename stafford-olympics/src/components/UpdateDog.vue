<template>
  <v-container class="pa-0">
    <v-card flat class="mb-0" color="background lighten-2">
      <v-card-text v-if="creating">
        <v-container fill-height>
          <v-row class="text-center" justify="center" align="center">
            <v-col cols="12" xs="12" sm="12" md="6">
              <v-progress-circular :size="100" color="primary" indeterminate
                >Updating</v-progress-circular
              >
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-text v-else-if="created" class="pb-0 mb-0">
        <v-container fill-height>
          <v-row class="text-center" justify="center" align="center">
            <v-col cols="12" xs="12" sm="12" md="6">
              <h2>{{ dog.name }}</h2>
              <p class="mb-0">has been succesfully updated</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-text v-else>
        <v-form
          ref="form"
          v-model="valid"
          @keyup.native.enter="valid && updateDog()"
        >
          <center>
            <image-input v-model="selectedImage">
              <div slot="activator">
                <v-avatar
                  size="120px"
                  v-ripple
                  v-if="!dog.image && !selectedImage"
                  class="grey ma-1"
                >
                  <span>Click to add image</span>
                </v-avatar>
                <v-avatar
                  size="120px"
                  v-ripple
                  v-else-if="selectedImage"
                  class="ma-1"
                >
                  <v-img :src="selectedImage.imageURL" />
                </v-avatar>
                <v-avatar size="120px" v-ripple v-else class="ma-1">
                  <v-img :src="getImage(dog.image)" />
                </v-avatar>
              </div>
            </image-input>
          </center>

          <v-text-field
            v-model.trim="dog.name"
            :rules="nameRules"
            prepend-icon="mdi-dog"
            label="Name"
            type="text"
            required
          ></v-text-field>

          <v-text-field
            v-model.trim="dog.height"
            :rules="heightRules"
            prepend-icon="mdi-dog"
            label="Height (cm)"
            type="number"
            required
          ></v-text-field>

          <v-text-field
            ref="chipnumber"
            v-model.trim="dog.chipnumber"
            :rules="chipnumberRules"
            prepend-icon="mdi-dog"
            label="Chipnumber"
            type="text"
            required
          ></v-text-field>

          <v-checkbox
            v-model="dog.retired"
            label="Retired"
            color="primary"
            hide-details
          ></v-checkbox>
        </v-form>
        <v-alert
          style="border: 1pt solid red !important"
          dense
          color="#360f0f"
          rounded="pill"
          v-if="err"
          type="error"
        >
          <small>{{ err }}</small>
        </v-alert>
      </v-card-text>

      <v-card-actions v-if="!creating && created" class="justify-center">
        <v-btn @click="done()" color="primary"> DONE </v-btn>
      </v-card-actions>
      <v-card-actions v-if="!creating && !created">
        <v-btn text @click="done()"> Cancel </v-btn>
        <v-btn color="primary" :disabled="!valid" @click="valid && updateDog()">
          UPDATE
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { storage } from "@/firebase";
import { dogsCollection } from "@/firebase";
import { nameRules, heightRules, chipnumberRules } from "@/validationrules";
import { capitalize, getImageUrl } from "@/stringutil";
import ImageInput from "@/components/ImageInput.vue";
import { mapGetters, mapState } from "vuex";

export default {
  name: "UpdateDog",
  data() {
    return {
      valid: false,
      nameRules: nameRules,
      heightRules: heightRules,
      chipnumberRules: chipnumberRules,
      creating: false,
      created: false,
      selectedImage: "",
      dog: {},
      err: "",
    };
  },
  created() {
    this.dog = { ...this.selectedDog };
    this.dogId = this.selectedDog.id;
  },
  components: { ImageInput: ImageInput },
  methods: {
    sleep(ms) {
      // Javascript heeft geen sleep functie, dus die moeten we zelf even maken
      return new Promise((res) => setTimeout(res, ms));
    },
    getImage(url) {
      return getImageUrl(url, false);
    },
    getClass(height) {
      let inInches = height * 0.393700787;
      if (inInches < 15) {
        return 14;
      }
      if (inInches >= 18) {
        return 18;
      }
      return Math.floor(inInches);
    },
    async updateDog() {
      if (
        this.dogs.some(
          (x) => x.id !== this.dogId && x.chipnumber === this.dog.chipnumber
        )
      ) {
        this.err = "There is already a dog with this chipnumber";
        this.$refs["chipnumber"].$refs.input.focus();
        return;
      }
      this.err = "";
      this.creating = true;
      if (this.selectedImage) {
        // Als er een image is geselecteerd dan deze eerst uploaden, zodat we een download URL hebben om toe toe voegen aan het dog object
        const fileExtention = this.selectedImage.imageFile.name
          .split(".")
          .pop();
        const filename = this.dog.chipnumber + "." + fileExtention;
        // this.dog.chipnumber + "-" + Date.now() + "." + fileExtention;
        const response = await storage
          .ref("images/" + filename)
          .put(this.selectedImage.imageFile);
        // Set image url on dog object
        this.dog.image = await response.ref.getDownloadURL();
        await this.sleep(2000);
      } 
      // Klasse toevoegen aan de hond
      this.dog.class = this.getClass(this.dog.height);
      // Naam van de hond capitalizen voor de mensen die niet goed hebben opgelet op school
      this.dog.name = capitalize(this.dog.name);
      this.dog.creator = this.user.data.uid;
      // Hond updaten

      //TODO Eerst image resize fixen en functions aanpassen

      dogsCollection
        .doc(this.dogId)
        .update(this.dog)
        .then(() => {
          this.created = true;
          this.creating = false;
        });
    },
    done() {
      this.creating = false;
      this.created = false;
      this.dog = null;
      this.selectedImage = null;
      this.$emit("onClose");
    },
  },
  computed: {
    ...mapGetters(["user"]),
    ...mapState(["dogs"]),
  },
  props: {
    selectedDog: Object,
  },
};
</script>
