<template>
  <div>
      <table class="table table-responsive">
          <thead class="thead-dark">
              <tr>
                  <th>Nombre</th>
                  <th>Categoria</th>
                  <th>Precio</th>
                  <th>En venta</th>
              </tr>
          </thead>
          <tbody>
              <ProductRow v-for="product in products" :key="product.id" :product="product"/>
          </tbody>
      </table>
  </div>
</template>

<script>
import ProductRow from '@/components/products/ProductRow';
export default {
    name:'ProductList',
    components:{ProductRow},
    computed:{
        products() {
            return this.$store.getters['products/list'];
        }
    },
}
</script>

<style>

</style>