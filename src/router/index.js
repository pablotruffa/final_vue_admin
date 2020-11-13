import Vue from "vue";
import VueRouter from "vue-router";

import AdminLogin from "../views/auth/AdminLogin";

import Home from "../views/Home.vue";
import Products from "../views/products/Products.vue";
import NewProduct from "../views/products/NewProduct.vue";
import EditProduct from "../views/products/EditProduct.vue";
import ProductInfo from "../views/products/ProductInfo.vue";

import Clients from "../views/clients/Clients.vue";
import ClientInfo from "../views/clients/ClientInfo.vue";
import NewClient from "../views/clients/NewClient.vue";

import Orders from "../views/orders/Orders.vue";

import store from '../store'
Vue.use(VueRouter);

const routes = [
  
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth:true,
      level:'admin',
    }
  },
  {
    path: "/login",
    name: "login",
    component: AdminLogin,
    meta: {
      requiresAuth:false,
    }
  },
  {
    path: "/products",
    name: "products",
    component: Products,
    meta: {
      requiresAuth:true,
      level:'admin',
    }
  },
  {
    path: "/product/new",
    name: "new-product",
    component: NewProduct,
    meta: {
      requiresAuth:true,
      level:'admin',
    }
  },
  {
    path: "/product/:id",
    name: "product-info",
    component: ProductInfo,
    meta: {
      requiresAuth:true,
      level:'admin',
    }
  },
  {
    path: "/product/:id/edit",
    name: "edit-product",
    component: EditProduct,
    meta: {
      requiresAuth:true,
      level:'admin',
    }
  },
  {
    path: "/clients",
    name: "clients",
    component: Clients,
    meta: {
      requiresAuth:true,
      level:'admin',
    }
  },
  {
    path: "/client/new",
    name: "new-client",
    component: NewClient,
    meta: {
      requiresAuth:true,
      level:'admin',
    }
  },
  {
    path: "/client/:id",
    name: "client-id",
    component: ClientInfo,
    meta: {
      requiresAuth:true,
      level:'admin',
    }
  },
  {
    path: "/orders",
    name: "orders",
    component: Orders,
    meta: {
      requiresAuth:true,
      level:'admin',
    }
  },
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  
  store.state.notification.title   = null;
  store.state.notification.message = null;
  store.state.notification.bClass  = null;
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.auth.logged) {
        if(to.meta.level == 'admin') {
          next({
            path: '/login',
          })
        }
      
    }else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresAuth == false)) {
    if(store.state.auth.logged){
      return false;
    }else{
      next()
    }
  }else {
    next() // make sure to always call next()!
  }
})

export default router;
