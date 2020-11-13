<template>
        <select id="category_id" class="form-control" v-model="selectedOption.category_id" @change="sendCategory">
            <option
            v-for="category in productCategories"
            :key="category.id"
            :value="category.id">{{category.name}}
            </option>
        </select>
</template>

<script>
export default {
    name:'SelectProductCategories',
    props:['selected_id'],
    computed: {
        productCategories() {
            return this.$store.getters['productCategories/list'];
        },
    },
    data: function(){
        return {
            selectedOption:{
                category_id:1
            }
        }
    },
    mounted(){
        if(this.$route.params.id){
            let product = this.$store.getters['products/byId'](this.$route.params.id);
            this.selectedOption.category_id = product.category_id;
        }
    },
    methods:{
        sendCategory() {
            this.$emit('category',this.selectedOption.category_id);
        }
    }
    
}
</script>

<style>

</style>