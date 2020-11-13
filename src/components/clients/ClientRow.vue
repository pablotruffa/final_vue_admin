<template>
    <tr>
        <td><router-link :to="pathToClient">{{client.room_number}}</router-link></td>
        <td>*********</td>
        <td v-if="client.deleted_at">Desactivado</td>
        <td v-else>Activado</td>
    </tr>
</template>

<script>
export default {
    name:'ClientRow',
    props:['client'],
    computed: {
        pathToClient() {
            return '/client/'+ this.client.id
        }
    }
}
</script>

<style>

</style>