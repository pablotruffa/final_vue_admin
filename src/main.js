import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import jQuery from 'jquery'
global.$ = jQuery;
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import firestore from './firestore/firestore';
Vue.prototype.$firebase = firestore;




Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
