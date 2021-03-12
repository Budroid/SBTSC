<template>
  <v-card flat height="250">
    <v-card-text style="padding-bottom: 0px; overflow: hidden">
      <v-container fill-height>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="12">
            <v-alert dense type="error" v-if="error">{{ error }}</v-alert>
            <v-alert dense type="info" v-if="success"
              ><small>{{ message }}</small></v-alert
            >

            <div
              style="
                width: 100%;
                height: 90%;
                align-items: center;
                display: flex;
              "
            >
              <v-radio-group
                v-if="!success && !error && !loading"
                v-model="permissionLevel"
              >
                <v-radio label="Admin" :value="3"></v-radio>
                <v-radio label="Teamcaptain" :value="2"></v-radio>
                <v-radio label="Member" :value="1"></v-radio>
              </v-radio-group>
              <v-progress-circular
                v-if="loading"
                :size="100"
                color="primary"
                indeterminate
                >Proccessing...</v-progress-circular
              >
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions v-if="!loading && !success && !error">
      <v-btn @click="cancel()"> Cancel </v-btn>
      <v-btn
        @click="
          loading = true;
          modify();
        "
        color="primary"
        :disabled="permissionLevel == initialValue"
      >
        Change
      </v-btn>
    </v-card-actions>
    <v-card-actions v-if="success || error">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="cancel()"> CLOSE </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import firebase from "firebase";
export default {
  name: "ModifyUser",
  data: () => ({
    permissionLevel: 0,
    initialValue: 0,
    success: false,
    error: "",
    message: "",
    loading: false,
  }),
  created() {
    this.permissionLevel = this.user.customClaims.permissionLevel;
    this.initialValue = this.user.customClaims.permissionLevel;
  },
  methods: {
    cancel() {
      this.$emit(this.success ? "onChanged" : "onCancel");
      // if (this.success) {
      //   this.$emit();
      // } else {
      //   this.$emit("onCancel");
      // }
    },
    modify() {
      console.log(
        `Permission level van ${this.user.email} moet naar ${this.permissionLevel}`
      );
      const modifyUser = firebase
        .functions()
        .httpsCallable("modifyPermissionLevel");
      console.log(this.permissionLevel);
      modifyUser({
        email: this.user.email,
        permissionLevel: this.permissionLevel,
      })
        .then((result) => {
          this.loading = false;
          this.success = true;
          this.error = "";
          this.message = `Role is set to: ${this.getRole(
            result.data.permissionLevel
          )}`;
          console.log("SUCCESS: " + this.message);
        })
        .catch((err) => {
          this.loading = false;
          this.success = false;
          this.error = err.message;
        });
    },
    getRole(permissionLevel) {
      if (permissionLevel == 3) {
        return "Admin";
      } else if (permissionLevel == 2) {
        return "Teamcaptain";
      }
      return "Member";
    },
  },
  props: {
    user: Object,
  },
};
</script>
