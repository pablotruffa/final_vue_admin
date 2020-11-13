<template>
    <div class="container">
        <header class="my-3">
            <h1>Productos</h1>
            <div><router-link to="/product/new">Agregar producto</router-link></div>
        </header>
        <main>
            <ProductList/>
        </main>
    </div>
</template>

<script>
import ProductList from '@/components/products/ProductList';
export default {
    name:'Products',
    components:{ProductList}
}
</script>

<style>

</style>