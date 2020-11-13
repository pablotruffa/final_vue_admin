<template>
    <div class="container">
        <header class="my-3">
            <h1>Editar producto</h1>
        </header>
        <main>
            <FormEditProduct/>
        </main>
    </div>
</template>

<script>
import FormEditProduct from '@/components/products/FormEditProduct';
export default {
    name:'EditProduct',
    components:{FormEditProduct}
}
</script>

<style>

</style>