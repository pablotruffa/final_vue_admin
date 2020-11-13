<template>
    <tr>
        <td><router-link :to="pathToProduct">{{product.name}}</router-link></td>
        <td>{{product.category.name}}</td>
        <td>{{product.price}}</td>
        <td v-if="product.sellable">Si</td>
        <td v-else>No</td>
    </tr>
</template>

<script>
export default {
    name:'ProductRow',
    props:['product'],
    computed: {
        pathToProduct() {
            return '/product/'+ this.product.id
        }
    }
}
</script>

<style>

</style>