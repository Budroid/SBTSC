<template>
  <v-container fill-height>
    <v-container>
      <v-row>
        <v-col align="center">
          <v-icon size="150" color="primary">mdi-account</v-icon>
        </v-col>
      </v-row>
      <v-row justify="space-around">
        <v-col cols="11" lg="3" align="center">
          <p>{{ user.data.displayName || 'Anonimous user' }}</p>
          <p>{{ user.data.email }}</p>
           <!-- <p>{{ user.permissionLevel }}</p> -->
          <v-btn to="/users" text color="primary" v-if="user.permissionLevel == 3"
            >Manage users</v-btn
          > 
        </v-col></v-row
      >
      <v-row justify="space-around">
        <v-col cols="11" lg="3" align="center">
          <v-btn @click="signOut">Logout</v-btn>
        </v-col></v-row
      >
    </v-container>
  </v-container>
</template>
<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
export default {
  created() {
    console.log("Profile created");
  },
  methods: {
    signOut(e) {
      e.stopPropagation();
      firebase.auth().signOut();
    },
  },
  computed: {
    ...mapGetters(["user"]),
  },
};
</script>
<style>
</style>