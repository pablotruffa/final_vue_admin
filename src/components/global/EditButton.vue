<template>
  <button 
  @click="editItem"
  :class="bclass"
  class="btn">{{title}}</button>
</template>

<script>
export default {
    name:'EditButton',
    props:['bClass','title'],
    computed: {
        bclass() {
            return 'btn-' + this.bClass;
        }
    },
    methods: {
        editItem() {
            this.$emit('edit');
        }
    }
}
</script>

<style>

</style>