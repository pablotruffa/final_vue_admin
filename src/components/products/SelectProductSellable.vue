<template>
    <select class="form-control" id="sellable" v-model="sellable.selectedOption" @change="sendOption" required>
        <option :value=1>Si</option>
        <option :value=0>No</option>
    </select>
</template>

<script>
export default {
    name:'SelectProductSellable',
    data: function() {
        return {
            sellable:{
                selectedOption:1
            }
        }
    },
    methods: {
        sendOption() {
            this.$emit('sellable', this.sellable.selectedOption);
        }
    },
    mounted(){
        if(this.$route.params.id){
            let product = this.$store.getters['products/byId'](this.$route.params.id);
            this.sellable.selectedOption = product.sellable;
        }
    },
}
</script>

<style>

</style>