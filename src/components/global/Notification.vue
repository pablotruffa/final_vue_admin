<template>
  <div class="container mt-3">
  <div
  :class="bclass"
  class="alert alert-dismissible fade show" role="alert">
  <strong>{{title}}</strong> {{message}}
  <button 
    @click="close"
    type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
</div>
</template>

<script>
export default {
    name: 'Notification',
    props:['title','message','bClass'],
    computed: {
        bclass() {
            return 'alert-'+ this.bClass;
        }
    },
    methods: {
        close() {
            this.$emit('close');
        }
    }

}
</script>

<style>

</style>