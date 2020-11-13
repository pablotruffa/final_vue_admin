<template>
  <div class="input-group mb-3">
        <select name="" class="form-control" v-model="selectedOption.status_id">
            <option 
            v-for="status in statusList" :key="status.id"
            :value="status.id">{{status.name}}</option>
        </select>
        <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="updateOrder">Actualizar</button>
        </div>
        </div>
</template>

<script>
export default {
    name:'OrderUpdater',
    props:['order_id','status_id'],
    data: function(){
        return {
            selectedOption:{
                status_id:this.status_id,
            },
        }
    },
    computed:{
        statusList() {
            return this.$store.getters['orderStatus/list'];
        } 
    },
    methods:{
        updateOrder(){
            this.$emit('updateOrder',this.order_id,this.selectedOption.status_id);
        }
    }
}
</script>

<style>

</style>