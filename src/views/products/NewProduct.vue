<template>
    <div class="container">
        <header class="my-3">
            <h1>Registrar nuevo producto</h1>
        </header>
        <main>
            <FormNewProduct/>
        </main>
    </div>
</template>

<script>
import FormNewProduct from '@/components/products/FormNewProduct';
export default {
    name:'NewProduct',
    components:{FormNewProduct}
}
</script>

<style>

</style>