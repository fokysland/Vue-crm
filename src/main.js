import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import router from './router'
import store from './store/index'
import dateFilter from '@/filters/date.filter'
import currencyFilter from '@/filters/currency.filter'
import tooltipDirective from '@/directives/tooltip.directive'
import messagePlugin from '@/utils/message.plugin'
import Loader from '@/components/app/Loader'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.config.productionTip = false

Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.directive('tooltip', tooltipDirective)
Vue.component('Loader', Loader)
Vue.use(Vuelidate)
Vue.use(messagePlugin)

const firebaseConfig = {
  apiKey: "AIzaSyA3wefdtDaqLQIdwJJlgIYrdmxWEknPKwQ",
  authDomain: "vue-crm-439ee.firebaseapp.com",
  databaseURL: "https://vue-crm-439ee.firebaseio.com",
  projectId: "vue-crm-439ee",
  storageBucket: "",
  messagingSenderId: "629081783193",
  appId: "1:629081783193:web:03912f252e04c919"
};

firebase.initializeApp(firebaseConfig);

let app;

firebase.auth().onAuthStateChanged(() => {
  if (app) return;
  app = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')  
});

