<template>
  <div>
  <b-modal id="modal" hide-footer>
    <template v-slot:modal-title>
      {{title}}
    </template>
    <div class="d-block text-center">
      <p>{{body}}</p>
    </div>
    <div>
      <b-button @click="accept" class="mr-1" variant="primary">Aceptar</b-button>
      <b-button @click="$bvModal.hide('modal')">Cancelar</b-button>
    </div>
  </b-modal>
</div>
</template>

<script>
export default {
    name: 'Modal',
    props:['title','body'],
    methods: {
      accept() {
        this.$emit('accept');
        this.$bvModal.hide('modal');
      }
    },
    
}
</script>

<style>

</style>