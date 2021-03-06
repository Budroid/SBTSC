<template>
  <v-app>
    <v-app-bar app dark>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <!-- <h1>Hier SO logo</h1> -->
      <h4>Debug</h4>
      <p>beforeInstallPrompt fired: {{ beforeInstallPrompt }}</p>
      <p>Mobile: {{ mobile }}</p>
      <p>Standalone: {{ standalone }}</p>
      <p>IOS: {{ ios }}</p>
      <p>Action: {{ action }}</p>
      <br />

      <!-- Tonen van de progress bar wanneer de app geinstalleerd wordt -->
      <div v-if="show_spinner && !appInstalled">
        <p>Stafford Olympics will now be installed on your device.</p>
        <p>Please wait, this will take about 10 seconds</p>
        <v-progress-linear
          height="20"
          striped
          indeterminate
          color="primary"
        ></v-progress-linear>
      </div>
      <!-- Installatie voltooid, geef de gebruiker de mogelijkheid de app meteen te openen  -->
      <div v-if="appInstalled && !show_spinner">
        <p>Installation finished successfully</p>
        <a
          id="openApp"
          href="https://stafford-olympics.web.app/"
          target="_blank"
          >Launch Stafford Olympics app</a
        >
      </div>
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
// import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  data: () => ({
    // Update handling
    snackbarUpdate: false,
    registration: null,
    refreshing: false,
    // Installation handling
    standalone: false,
    ios: false,
    mobile: false,
    action: "",
    appInstalled: false,
    show_spinner: false,
    beforeInstallPrompt: false,
  }),

  created() {
    // Data verzamelen om het type instalatie te kunnen bepalen
    // Uit de user agent kunnen we basis info halen zoals mobiel/destop enzo.
    // Standalone geeft aan dat het om een geinstalleerde versie van de app gaat, geen installatie in dat geval.
    const uaString = navigator.userAgent.toLowerCase();
    this.mobile = this.isMobile(uaString);
    this.ios = this.isIos(uaString);
    this.standalone = this.isStandalone();

    window.addEventListener("beforeinstallprompt", (e) => {
      this.beforeInstallPrompt = true;
      console.log(e);
      // // show the add button
      // this.promptIntercepted = true;
      // // Prevent Chrome 67 and earlier from automatically showing the prompt
      // // no matter what, the snack-bar shows in 68 (06/16/2018 11:05 AM)
      // e.preventDefault();
      // // Stash the event so it can be displayed when the user wants.
      // this.deferredPrompt = e;
      // this.promptSaved = true;
    });

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
  },
  mounted() {
    window.addEventListener("appinstalled", async () => {
      // De naam van dit event is misleidend. Het gaat af wanneer de installatie start, niet wanneer deze eindigt.
      // We kunnen de app pas openen wanneer deze volledig geinstalleerd is.
      // Hier bestaat geen callback voor dus moeten we onderstaande truc toepassen en elke seconde checken of de app volledig geinstaleerd is.
      // Start spinner
      this.show_spinner = true;
      // Wacht tot de installatie voltooid is.
      await this.waitForInstallationFinish();
      // Het automatisch openen van de app mag niet, om beveiligingsredenen.
      // Daarom middels een link de gebruiker de optie geven om te app te openen. Deze link wordt actief wanneer de app voledig geinstalleerd is.
      this.appInstalled = true;
      // Stop spinner
      this.show_spinner = false;
    });
  },
  methods: {
    async waitForInstallationFinish() {
      // Check every second if app is fully installed
      while (!(await this.isAppInstalled())) {
        await this.sleep(1000);
      }
    },
    async isAppInstalled() {
      let relatedApps = await navigator.getInstalledRelatedApps();
      return relatedApps ? relatedApps.length > 0 : false;
    },
    isStandalone() {
      return window.matchMedia("(display-mode: standalone)").matches;
    },
    isIos(uaString) {
      return (
        uaString.indexOf("iphone") != -1 ||
        uaString.indexOf("ipad") != -1 ||
        uaString.indexOf("ipod") != -1
      );
    },
    isMobile(uaString) {
      return /mobile/.test(uaString);
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
    sleep(ms) {
      return new Promise((res) => setTimeout(res, ms));
    },
  },
  components: {},
};
</script>
