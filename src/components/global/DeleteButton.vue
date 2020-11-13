<template>
  <button 
  @click="deleteItem"
  :class="bclass"
  class="btn">{{title}}</button>
</template>

<script>
export default {
    name:'DeleteButton',
    props:['bClass','title'],
    computed: {
        bclass() {
            return 'btn-' + this.bClass;
        }
    },
    methods: {
        deleteItem() {
            this.$emit('delete');
        }
    }
}
</script>

<style>

</style>