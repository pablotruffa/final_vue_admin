<template>
  <div class="container">
      <header class="my-3">
          <h1>Ordenes</h1>
      </header>
      <main>
          <MyOrders/>
      </main>
  </div>
</template>

<script>
import MyOrders from '@/components/orders/MyOrders';
export default {
    name:'Orders',
    components:{MyOrders}
}
</script>

<style>

</style>