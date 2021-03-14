<template>
  <v-container fluid pa-0 ma-0>
    <v-row justify="center">
      <v-col cols="12" xs="12" sm="12" md="6" lg="5" xl="4">
        <!-- <v-alert dense type="error" v-if="error != ''">{{ error }}</v-alert> -->
        <div
          v-if="loading"
          style="width: 100%; height: 90vh; align-items: center; display: flex"
        >
          <v-progress-circular :size="100" color="primary" indeterminate
            >Loading...</v-progress-circular
          >
        </div>

        <v-list v-else dense two-line>
          <template v-for="appUser in users">
            <v-list-item :key="appUser.uid" @click.native="showDialog(appUser.uid)" v-ripple="{ center: true }" :disabled="appUser.email === user.data.email">
              <v-list-item-avatar>
                <v-img :src="appUser.photoURL"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  v-html="appUser.displayName"
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-html="appUser.email"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon
                  v-if="appUser.customClaims.permissionLevel == 3"
                  color="primary"
                  >mdi-account-key</v-icon
                >
                <v-icon
                  v-else-if="appUser.customClaims.permissionLevel == 2"
                  color="yellow lighten-1"
                  >mdi-account-multiple</v-icon
                >
              </v-list-item-action>
            </v-list-item>
            <v-divider v-bind:key="appUser.email" />
          </template>
        </v-list>
      </v-col>
    </v-row>

    <!-- Modify user dialog -->
    <v-dialog
      v-if="modifyUserDialog"
      :value="true"
      @input="modifyUserDialog = false"
      width="200"
      scrollable="false"
    >
      <modify-user
        :user="selectedUser"
        @onCancel="modifyUserDialog = false"
        @onChanged="update"
        @onError="showError"
      />
    </v-dialog>
    <v-snackbar
      color="success"
      centered
      rounded="pill"
      v-model="userUpdatedSnackbar"
      timeout="2500"
    >
      <v-alert
        style="padding: 0px; margin: 0px"
        dense
        v-if="selectedUser"
        type="success"
        >User with email {{ selectedUser.email }} is now
        {{ getRole(selectedUser.customClaims.permissionLevel) }}</v-alert
      >
    </v-snackbar>
    <v-snackbar
      dense
      color="error"
      centered
      rounded="pill"
      v-model="userErrorSnackbar"
      timeout="2500"
    >
      <v-alert
        style="padding: 0px; margin: 0px"
        dense
        v-if="error"
        type="error"
        >{{ error }}</v-alert
      >
    </v-snackbar>
  </v-container>
</template>
<script>
import firebase from "firebase";
import ModifyUser from "@/components/ModifyUser.vue";
import { mapGetters } from "vuex";
export default {
  data: () => ({
    users: [],
    selectedUser: null,
    modifyUserDialog: false,
    userUpdatedSnackbar: false,
    userErrorSnackbar: false,
    error: "",
    loading: true,
  }),
  created() {
    const listUsers = firebase.functions().httpsCallable("listUsers");
    listUsers()
      .then((result) => {
        this.users = result.data;
        this.loading = false;
      })
      .catch((err) => {
        this.error = err.message;
        this.loading = false;
        this.userErrorSnackbar = true;
      });
  },
  methods: {
    update(value) {
      // Update UI with value from server
      this.selectedUser.customClaims.permissionLevel = value;
      this.modifyUserDialog = false;
      this.userUpdatedSnackbar = true;
    },
    showError(value) {
      // Update UI with value from server
      // this.selectedUser.customClaims.permissionLevel = value;
      this.error = value;
      this.modifyUserDialog = false;
      this.userErrorSnackbar = true;
    },
    showDialog(uid) {
      // Get user from list
      this.selectedUser = this.users.find((x) => x.uid === uid);
      this.modifyUserDialog = true;
    },
    getRole(permissionLevel) {
      if (permissionLevel == 3) {
        return "ADMIN";
      } else if (permissionLevel == 2) {
        return "TEAMCAPTAIN";
      }
      return "MEMBER";
    },
  },
   computed: {
    ...mapGetters(["user"]),
  },
  components: {
    ModifyUser,
  },
};
</script>
<style>
.v-progress-circular {
  /* display: block;
    width: 100px; */
  margin: 0 auto;
}
</style>
