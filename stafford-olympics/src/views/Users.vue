<template>
  <v-container fluid pa-0 ma-0>
    <v-row justify="center">
      <v-col cols="12" xs="12" sm="12" md="6" lg="5" xl="4">
        <div
          v-if="loading"
          style="width: 100vw; height: 90vh; align-items: center; display: flex"
        >
          <v-progress-circular :size="100" color="primary" indeterminate
            >Loading...</v-progress-circular
          >
        </div>

        <v-list v-else dense two-line :key="componentKey">
          <template v-for="user in users">
            <v-list-item :key="user.uid" @click.native="showDialog(user.uid)">
              <v-list-item-avatar>
                <v-img :src="user.photoURL"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  v-html="user.displayName"
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-html="user.email"
                ></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon
                  v-if="user.customClaims.permissionLevel == 3"
                  color="primary"
                  >mdi-account-key</v-icon
                >
                <v-icon
                  v-else-if="user.customClaims.permissionLevel == 2"
                  color="yellow lighten-1"
                  >mdi-account-multiple</v-icon
                >
              </v-list-item-action>
            </v-list-item>
            <v-divider v-bind:key="user.email" />
          </template>
        </v-list>
      </v-col>
    </v-row>

    <!-- Modify user dialog -->
    <!-- v-if="modifyUserDialog" :value="true" @input="modifyUserDialog = false" -->
    <v-dialog
      v-if="modifyUserDialog"
      :value="true"
      @input="modifyUserDialog = false"
      width="300"
      scrollable="false"
    >
      <modify-user
        :user="selectedUser"
        @onCancel="modifyUserDialog = false"
        @onChanged="update()"
      />
    </v-dialog>
    <v-snackbar :value="error" :timeout="4"> {{ error }}} </v-snackbar>
  </v-container>
</template>
<script>
import firebase from "firebase";
import ModifyUser from "@/components/ModifyUser.vue";
export default {
  data: () => ({
    users: [],
    selectedUser: null,
    modifyUserDialog: false,
    error: "",
    loading: true,
    componentKey: 0,
  }),
  created() {
    console.log("User page created");
    const listUsers = firebase.functions().httpsCallable("listUsers");
    listUsers()
      .then((result) => {
        this.users = result.data;
        this.loading = false;
      })
      .catch((err) => {
        this.error = err;
        this.loading = false;
      });
  },
  methods: {
    update() {
      this.modifyUserDialog = false
      this.componentKey += 1;  
    },
    showDialog(uid) {
      // Get user from list
      this.selectedUser = this.users.find((x) => x.uid === uid);
      this.modifyUserDialog = true;
    },
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
