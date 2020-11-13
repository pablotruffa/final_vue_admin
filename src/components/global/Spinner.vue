<template>
  <div>
    <b-spinner label="loading" variant="info"></b-spinner>
  </div>
</template>

<script>
export default {
    name:'Spinner',
    props:['bool'],
    data:function(){
        return {
            spinning:this.bool,
        }
    }
}
</script>

<style>

</style>