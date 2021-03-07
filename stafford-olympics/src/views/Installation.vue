<template>
  <v-container>
    <!-- Alleen installatie procedure wanneer de app niet is geinstalleerd -->
    <div>
      <!-- Tonen van de progress bar wanneer de app geinstalleerd wordt -->
      <div v-if="showSpinner && !appInstalled">
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
      <div v-if="appInstalled && !showSpinner">
        <p>Installation finished successfully</p>
        <p>You will find the Stafford Olympics app among your other apps.</p>
        <p>You can close this window, you don't need it anymore.</p>
      </div>
    </div>

    <!-- Snackbar iOS -->
    <v-snackbar tile :value="snackbarIos" :timeout="-1" light>
      <v-row>
        <v-col cols="2" style="padding: 8px 0px 8px 4px"
          ><v-img width="33px" src="@/assets/snack_logo.png"></v-img
        ></v-col>
        <v-col cols="10" style="padding: 8px 8px 8px 0px"
          ><p style="color: #1e72e2; font-size: 11pt; margin: 0">
            To install the app on your device, click
            <img
              style="vertical-align: middle"
              width="16px"
              src="@/assets/safari-share.png"
            />
            below and
            <img
              style="vertical-align: middle"
              width="19px"
              src="@/assets/a2hs.png"
            />
            (Add to homescreen)
          </p></v-col
        >
      </v-row>
    </v-snackbar>

    <!-- Default Android Snackbar  -->
    <v-snackbar tile :value="snackbarAndroidDefault" :timeout="-1" light>
      <v-row>
        <v-col cols="2" style="padding: 8px 0px 8px 4px"
          ><v-img width="33px" src="@/assets/snack_logo.png"></v-img
        ></v-col>
        <v-col cols="10" style="padding: 8px 8px 8px 0px"
          ><p style="color: #1e72e2; font-size: 9pt; margin: 0">
            Please open the link in chrome or check if your browser has an
            option to install this site as an app on your device.
          </p></v-col
        >
      </v-row>
    </v-snackbar>

    <!-- Default desktop snackbar -->
    <v-snackbar tile :value="snackbarDesktop" :timeout="-1" light>
      <v-row>
        <v-col cols="2" style="padding: 8px 0px 8px 4px"
          ><v-img width="33px" src="@/assets/snack_logo.png"></v-img
        ></v-col>
        <v-col cols="10" style="padding: 8px 8px 8px 0px"
          ><p style="color: #1e72e2; font-size: 11pt; margin: 0">
            To install this page as a desktop application, open the link in
            Chrome
          </p></v-col
        >
      </v-row>
    </v-snackbar>

    <!-- Snackbar automatic install -->
    <v-snackbar
      tile
      :value="snackbarAutomaticInstall"
      :timeout="-1"
      light
      @click.native="install()"
    >
      <v-row>
        <v-col cols="2" style="padding: 8px 0px 8px 4px"
          ><v-img width="33px" src="@/assets/snack_logo.png"></v-img
        ></v-col>
        <v-col cols="10" style="padding: 8px 8px 8px 0px"
          ><p style="color: #1e72e2; font-size: 12pt; margin: 0">
            Install Stafford Olympics on your device
          </p></v-col
        >
      </v-row>
    </v-snackbar>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    // Installation handling
    standalone: false,
    appInstalled: false,
    showSpinner: false,
    beforeInstallPrompt: false,
    deferredPrompt: {},
    snackbarIos: false,
    snackbarAndroidDefault: false,
    snackbarDesktop: false,
    snackbarAutomaticInstall: false,
  }),
  created() {
    // Data verzamelen om het type instalatie te kunnen bepalen
    // Uit de user agent kunnen we basis info halen zoals mobiel/destop enzo.
    // Standalone geeft aan dat het om een geinstalleerde versie van de app gaat, geen installatie in dat geval.
    const uaString = navigator.userAgent.toLowerCase();
    const mobile = this.isMobile(uaString);
    const ios = this.isIos(uaString);
    // Na 2 seconden de snackbar tonen. Dan is bekend of het beforeInstallPrompt event gefired is. Bovendien geeft het in combinatie
    // met de transitie van de snackbar een aandachtstrekkend effect.
    setTimeout(() => {
      this.showInstallationSnackbar(mobile, ios);
    }, 1500);

    window.addEventListener("beforeinstallprompt", (e) => {
      this.beforeInstallPrompt = true;
      this.snackbarAutomaticInstall = true;
      // Laat de default installation banner van Chrome niet meer zien
      e.preventDefault();
      // Stash the event so it can be displayed when the user wants.
      this.deferredPrompt = e;
    });

    window.addEventListener("appinstalled", async () => {
      // De naam van dit event is misleidend. Het gaat af wanneer de installatie start, niet wanneer deze eindigt.
      // We kunnen de app pas openen wanneer deze volledig geinstalleerd is.
      // Hier bestaat geen callback voor dus moeten we onderstaande truc toepassen en elke seconde checken of de app volledig geinstaleerd is.
      await this.waitForInstallationFinish();
      // Het automatisch openen van de app mag niet, om beveiligingsredenen.
      // Daarom middels een link de gebruiker de optie geven om te app te openen. Deze link wordt actief wanneer de app voledig geinstalleerd is.
      this.appInstalled = true;
      // Stop spinner
      this.showSpinner = false;
    });
  },
  methods: {
    showInstallationSnackbar(mobile, ios) {
      this.snackbarIos = mobile && ios;
      this.snackbarAndroidDefault = !ios && mobile && !this.beforeInstallPrompt;
      this.snackbarDesktop = !mobile && !this.beforeInstallPrompt;
      this.snackbarAutomaticInstall = this.beforeInstallPrompt;
    },
    resetSnacks() {
      this.snackbarIos = false;
      this.snackbarAndroidDefault = false;
      this.snackbarDesktop = false;
      this.snackbarAutomaticInstall = false;
    },
    install() {
      this.resetSnacks();
      if (!this.deferredPrompt) {
        return;
      }
      // Show the prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          // Start spinner
          this.showSpinner = true;
        }
      });
    },
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
    sleep(ms) {
      // Javascript heeft geen sleep functie, dus die moeten we zelf even maken
      return new Promise((res) => setTimeout(res, ms));
    },
  },
};
</script>
<style>
@media only screen and (max-width: 480px) {
  .v-snack__wrapper {
    width: 100vw !important;
  }
}
</style>
