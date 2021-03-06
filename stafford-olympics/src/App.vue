<template>
  <v-app>
    <v-app-bar app dark v-if="localUser">
      <v-btn v-if="currentRoute.back" icon @click="$router.back()">
        <v-icon style="margin-right: 10px">mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ currentRoute.title }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      
      <router-view />
      
    </v-main>

    <!-- Update snackbar -->
    <v-snackbar :value="snackbarUpdate" :timeout="-1">
      New version available!
      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          text
          right
          color="#00f500"
          @click.native="refreshApp"
          >Update</v-btn
        >
      </template>
    </v-snackbar>
    <!-- Navigation -->
    <v-bottom-navigation
      v-if="localUser && !currentRoute.back"
      app
      fixed
      grow
      v-model="navItem"
      color="primary"
    >
      <v-btn tile value="0" to="/">
        <span>Tournaments</span>
        <v-icon>mdi-trophy</v-icon>
      </v-btn>

      <v-btn value="1" to="/dogs">
        <span>Dogs</span>
        <v-icon>mdi-dog</v-icon>
      </v-btn>

      <v-btn value="2" to="/profile">
        <span>Profile</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
// import { mapState } from 'vuex';
import { auth } from "./firebase";
export default {
  name: "App",
  data: () => ({
    localUser: null,
    // Update handling
    snackbarUpdate: false,
    registration: null,
    refreshing: false,
    // Navigation
    navItem: null,
  }),
  created() {
    // Refresh alle open app tabs wanneer een nieuwe service worker is geinstalleerd.
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (this.refreshing) return;
        this.refreshing = true;
        window.location.reload();
      });
    } else {
      console.log("No service worker");
    }
    // Service worker geupdate, presenteer de gebruiker de update button
    document.addEventListener("swUpdated", this.showRefreshUI, {
      once: true,
    });

    // Als de autenticatie state veranderd is, dan dit gelijk doorvoeren
    auth.onAuthStateChanged(async (user) => {
      this.localUser = user;
      if (user) {
        // Force refresh token om aangepaste custom claims te activeren
        await user.getIdToken(true);
        // Custom claims aan het user object toevoegen om rechten te bepalen. Store updaten
        user.getIdTokenResult().then((idTokenResult) => {
          this.$store.dispatch("commitUser", {
            data: user,
            permissionLevel: idTokenResult.claims.permissionLevel,
          });
        });
        // Populate de store met de data uit Firebase
        this.$store.dispatch("bindDogs");
        this.$store.dispatch("bindTournaments");
      }
    });
  },
  beforeDestroy() {
    // Stop de data bindings
    this.$store.dispatch("unbindDogs");
    this.$store.dispatch("unbindTournaments");
  },
  methods: {
    showRefreshUI(e) {
      this.registration = e.detail;
      this.snackbarUpdate = true;
    },
    refreshApp() {
      this.snackbarUpdate = false;
      // Beveiling tegen missende registration.waiting
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage("skipWaiting");
    },
  },
  computed: {
    currentRoute() {
      return this.$route.meta.page
        ? this.$route.meta.page
        : { title: "Stafford Olympics", back: false };
    },
  },
  components: {},
};
</script>
<style lang="postcss" scoped>
.v-item-group.v-bottom-navigation .v-btn {
  height: inherit !important;
}
.v-item-group.v-bottom-navigation .v-btn--active::before {
  opacity: 0 !important;
}
@media only screen and (max-width: 430px) and (max-height: 400px) {
  .v-item-group.v-bottom-navigation {
    display: none;
  }
}
</style>

