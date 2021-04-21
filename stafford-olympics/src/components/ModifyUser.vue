<template>
  <v-card flat>
    <v-card-text style="padding-bottom: 0px; overflow: hidden">
      <v-container fill-height>
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="12">
            <!-- <v-alert dense type="error" v-if="error">{{ error }}</v-alert> -->

            <div
              style="
                width: 100%;
                height: 90%;
                align-items: center;
                display: flex;
              "
            >
              <v-radio-group v-if="!loading" v-model="permissionLevel">
                <v-radio label="Admin" :value="3"></v-radio>
                <v-radio label="Teamcaptain" :value="2"></v-radio>
                <v-radio label="Member" :value="1"></v-radio>
              </v-radio-group>
              <v-progress-circular
                v-else
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
    <v-card-actions v-if="!loading">
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
    <!-- <v-card-actions v-if="error">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="cancel()"> CLOSE </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions> -->
  </v-card>
</template>

<script>
import { functions } from "@/firebase";
export default {
  name: "ModifyUser",
  data: () => ({
    permissionLevel: 0,
    initialValue: 0,
    loading: false,
  }),
  created() {
    this.permissionLevel = this.user.customClaims.permissionLevel;
    this.initialValue = this.user.customClaims.permissionLevel;
  },
  methods: {
    cancel() {
      this.$emit("onCancel");
    },
    modify() {
      const modifyUser = functions.httpsCallable("modifyPermissionLevel");
      modifyUser({
        email: this.user.email,
        permissionLevel: this.permissionLevel,
      })
        .then((result) => {
          this.loading = false;
          this.$emit("onChanged", result.data.permissionLevel);
        })
        .catch((err) => {
          this.loading = false;
          this.$emit("onError", err.message);
        });
    },
  },
  props: {
    user: Object,
  },
};
</script>
