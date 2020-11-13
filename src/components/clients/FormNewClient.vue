<template>
    <div>
        <form @submit.prevent="add">
            <div class="form-group">
                <label for="room">Número de Habitación:</label>
                <input type="text" class="form-control" id="room" v-model="client.room_number">
                <div v-if="errors.room_number" class="alert alert-danger" role="alert">{{errors.room_number}}</div>
            </div>
            <div class="form-group">
                <label for="password">Contraseña:</label>
                <input type="password" class="form-control" id="password" v-model="client.password">
                <div v-if="errors.password" class="alert alert-danger" role="alert">{{errors.password}}</div>
            </div>
            <button class="btn btn-primary">Agregar</button>

        </form>
    </div>
</template>

<script>
export default {
    name:'FormNewClient',
    data:function(){
        return {
            client:{
                room_number:null,
                password:null,
            },
            errors:{
                room_number:'',
                password:'',
            }
        }
    },
    methods: {
        validate(){
            this.errors.room_number = '';
            this.errors.password = '';

            let errors = 0;
            if(this.$store.getters['clients/byRoomNumber'](this.client.room_number)){
                errors++;
                this.errors.room_number = `El cliente ${this.client.room_number} ya existe. `;
            }
            if(isNaN(this.client.room_number) || this.client.room_number < 0){
                errors++;
                this.errors.room_number = 'Tiene que ser un número entero positivo.';
            }
            if(this.client.password.length < 6){
                errors++;
                this.errors.password = 'Contraseña corta. Mínimo 6 caracteres.';
            }

            return (errors == 0) ? true:false;
            
        },
        add() {
            if(!this.validate()){
                return false;      
            }
            this.client.email = this.client.room_number+'@roomserviceapp.com';
            this.$store.dispatch('clients/create',this.client).then(response => {
                if(response == true){
                    this.$router.push('/clients').then(()=>{
                        this.$store.commit('SET_NOTIFICATION',{
                            title:'Acción completada. ',
                            message:'Cliente agregado',
                            bClass:'success',
                        });
                    })
                }
            })
        }
    }
}
</script>

<style>

</style>