import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify';
import firebase from 'firebase'

Vue.config.productionTip = false

// En nee meneer de assessor, het is niet erg dat dit hier staat:
const firebaseConfig = {
  apiKey: "AIzaSyBNYrXuL7JNwdsx0ORcrm8S_FP-n1cx-7I",
  authDomain: "stafford-olympics.firebaseapp.com",
  projectId: "stafford-olympics",
  storageBucket: "stafford-olympics.appspot.com",
  messagingSenderId: "1082270760609",
  appId: "1:1082270760609:web:4bfdd005884304ed2ffae0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
