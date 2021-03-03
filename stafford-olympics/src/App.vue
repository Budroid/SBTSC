<template>
  <v-app>
    <v-app-bar app dark>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <HelloWorld />
    </v-main>
    <v-snackbar v-model="snackbarUpdate" :timeout="-1">
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
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  data: () => ({
    page: "Tournaments",
    snackbarUpdate: false,
    registration: null,
    refreshing: false
  }),
  created() {
    document.addEventListener("swUpdated", this.showRefreshUI, {
      once: true,
    });
    // Refresh all open app tabs when a new service worker is installed.
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (this.refreshing) return;
        this.refreshing = true;
        window.location.reload();
      });
    } else {
      console.log("No service worker");
    }
  },
  methods: {
    showRefreshUI(e) {
      this.registration = e.detail;
      this.snackbarUpdate = true;
    },
    refreshApp() {
      this.snackbarUpdate = false;
      // Protect against missing registration.waiting.
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage("skipWaiting");
    },
  },
  components: {
    HelloWorld,
  },
};
</script>
