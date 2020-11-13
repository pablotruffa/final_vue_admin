<template>
<div class="container my-3">
  <h1>Bienvenid@</h1>
  <p>Recibe los pedidos de tus clientes de una manera muy facil.</p>
  <div>
    <img src="img/roomservice.jpg" class="img-fluid" alt="Responsive image">
  </div>
  <hr>
  <p>Te enseñaré a como usar <b>Room Service</b> de manera rápida y sencilla con la siguiente guía básica.</p>
  <ul>
    <li>Para ver los pedidos de tus clientes haz click en el menú <router-link to="/orders">Pedidos</router-link>.</li>
    <li>Para registrar, editar o eliminar productos del menú dirigete a <router-link to="/products">Productos</router-link>.</li>
    <li>Si quieres agregar clientes y regular permisos de un cliente dirigite a <router-link to="/clients">Clientes</router-link>.</li>
  </ul>
  </div>
</template>

<script>
import { fauth } from '../firestore/firestore';
export default {
  name:'Home',
  components:{},
  data:function(){
    return {
      products:[]
    }
  },
  computed:{
    user() {
      try {
        return fauth.currentUser;
        
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
}
</script>

<style>

</style>