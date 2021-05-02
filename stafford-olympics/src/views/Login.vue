<template>
  <v-container fill-height>
    <v-container>
      <v-row>
        <v-col align="center"
          ><v-img width="150px" src="@/assets/logo_groot.png"></v-img>
        </v-col>
      </v-row>
      <v-row justify="space-around">
        <v-col cols="11" lg="3" align="center">
          <div>
            <section id="firebaseui-auth-container"></section>
          </div> </v-col
      ></v-row>
    </v-container>
  </v-container>
</template>
<script>
import * as firebaseui from 'firebaseui'
import "firebaseui/dist/firebaseui.css";
import { auth, GOOGLE_PROVIDER_ID, FACEBOOK_PROVIDER_ID, EMAIL_PROVIDER_ID } from '@/firebase'
export default {
  mounted() {
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(auth);
    }
    const uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [
        {
          provider: GOOGLE_PROVIDER_ID,
          customParameters: {
            // Forces account selection even when one account
            // is available.
            prompt: "select_account",
          },
        },
        FACEBOOK_PROVIDER_ID,
        EMAIL_PROVIDER_ID,
      ],
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  },
};
</script>
<style>
ul.firebaseui-idp-list {
  margin: 0px !important;
  padding: 0px !important;
}
</style>