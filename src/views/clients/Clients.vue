<template>
  <div class="container">
      <header class="my-3">
        <h1>Clientes</h1>
        <div><router-link to="/client/new">Agregar cliente</router-link></div>
      </header>
      <main>
        <ClientList/>
      </main>
      
  </div>
</template>

<script>
import ClientList from '@/components/clients/ClientList';
export default {
    name:'Clients',
    components:{ClientList}
}
</script>

<style>

</style>