import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate'

import './firebase'

Vue.config.productionTip = false
Vue.use(Vuelidate)
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
