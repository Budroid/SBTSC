<template>
  <v-container class="pa-0">
    <v-card flat class="mb-0" color="background lighten-2">
      <v-card-text>
        {{ dog.image }}
        <v-form
          ref="form"
          v-model="valid"
          @keyup.native.enter="valid && createDog()"
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
                <v-avatar size="120px" v-ripple v-else class="ma-1">
                  <v-img :src="selectedImage.imageURL" />
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
            v-model.trim="dog.chipnumber"
            :rules="chipnumberRules"
            prepend-icon="mdi-dog"
            label="Chipnumber"
            type="text"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="done()"> Cancel </v-btn>
        <v-btn color="primary" :disabled="!valid" @click="valid && createDog()">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { dogsCollection } from "@/firebase";
import { storage } from "@/firebase";
import ImageInput from "@/components/ImageInput.vue";

export default {
  name: "AddDog",
  data() {
    return {
      valid: false,
      nameRules: [(v) => !!v || "Name is required"],
      heightRules: [
        (v) => !!v || "Height is required",
        (v) =>
          (v && /^-?\d+(\.\d+)?$/.test(v)) ||
          "Height must be like 42 or 40.6 (dot, no comma)",
      ],
      chipnumberRules: [
        (v) => !!v || "Chipnumber is required",
        (v) => (v && v.length >= 6) || "Invalid chipnumber",
      ],
      creating: false,
      created: false,
      selectedImage: "",
      dog: {
        name: "",
        height: "",
        chipnumber: "",
        image: "",
      },
      classes: [14, 15, 16, 17, 18],
      // Errors
    };
  },
  components: { ImageInput: ImageInput },
  methods: {
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
    async createDog() {
      if (this.selectedImage) {
        // Als er een image is geselecteerd dan deze eerst uploaden, zodat we een download URL hebben om toe toe voegen aan het dog object
        const fileExtention = this.selectedImage.imageFile.name.split(".").pop();
        const filename = this.dog.chipnumber + "-" + Date.now() + "." + fileExtention;
        const response = await storage
          .ref("images/" + filename)
          .put(this.selectedImage.imageFile);
        // Set image url on dog object
        this.dog.image = await response.ref.getDownloadURL();
      }
      this.creating = true;
      // Klasse toevoegen aan de hond
      this.dog.class = this.getClass(this.dog.height);
      // Hond oplslaan in de firestore
      dogsCollection.add(this.dog).then(() => {
        this.created = true;
        this.creating = false;
      });
      this.done();
    },
    done() {
      this.$emit("onClose");
      this.reset();
      this.creating = false;
      this.created = false;
    },
    reset() {
      this.dog = {};
      this.selectedImage = ""
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },
  },
};
</script>
