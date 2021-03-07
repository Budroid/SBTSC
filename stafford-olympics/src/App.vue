<template>
  <v-app>
    <v-app-bar app dark v-if="isLoggedIn">
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
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    // Update handling
    snackbarUpdate: false,
    registration: null,
    refreshing: false,
    // User management
    isLoggedIn: false,
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
    window.addEventListener("swUpdated", this.showRefreshUI, {
      once: true,
    });

    if (!this.isStandalone()){
       this.$router.push({
        name: "Installation",
      });
    }
  },
  methods: {
    isStandalone() {
      return window.matchMedia("(display-mode: standalone)").matches;
    },

    showRefreshUI(e) {
      this.registration = e.detail;
      this.snackbarUpdate = true;
    },
    refreshApp() {
      this.snackbarUpdate = false;
      // Beveilig tegen missende registration.waiting
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage("skipWaiting");
    },
  },
  components: {},
};
</script>

