import Vue from "vue";
import Vuex from "vuex";

const API_ROUTE = 'http://localhost:8000/api';

Vue.use(Vuex);

import authentication from '../modules/authentication';
import products from '../modules/products';
import productCategories from '../modules/productCategories';
import clients from '../modules/clients';
import orders from '../modules/orders';
import orderStatus from '../modules/orderStatus';

export default new Vuex.Store({
  state: {
    api_route: API_ROUTE,
    auth:{
      logged:false,
      level:null,
    },
    notification: {
      title:null,
      message:null,
      bClass:null,
    },
    modal: {
      title:null,
      body:null,
    },
    ready:false,

  },

  getters: {

    notification: (state) => {
        return state.notification;
    },
    modal: (state) => {
        return state.modal;
    },
    storeState : (state) => {
      return state.ready;
    }

  },

  mutations: {  

    SET_NOTIFICATION_NULL(state) {
      state.notification.title    = null;
      state.notification.message  = null;
      state.notification.bClass   = null;
    },
    SET_NOTIFICATION(state, content) {
      state.notification.title    = content.title;
      state.notification.message  = content.message;
      state.notification.bClass   = content.bClass;
    },
    SET_MODAL(state, payload) {
      state.modal.title   = payload.title;
      state.modal.body    = payload.body;
    },
    SET_STORE_READY(state,bool){
      state.ready = bool;
    },
    SET_AUTH(state,payload) {
      state.auth = payload;
    }

  },
  actions: {
      ini(context) {
        let products    = context.dispatch('products/get');
        let categories  = context.dispatch('productCategories/get');
        let clients     = context.dispatch('clients/get');
        let orders      = context.dispatch('orders/get');
        let orderStatus = context.dispatch('orderStatus/get');
        
        Promise.all([products,categories,clients,orders,orderStatus]).then((val)=>{
          if(val.includes(false)){
            console.log('Faltan datos para inicializar...');
            return false;
          }else{
            context.commit('SET_STORE_READY',true);
          }
          
        });
      }
  },
  modules: {
    authentication,
    products,
    productCategories,
    clients,
    orders,
    orderStatus,
  }
});
