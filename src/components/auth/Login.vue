<template>
  <div>
    <form @submit.prevent="login">
        <div class="form-group">
            <label for="user">Usuario</label>
            <input type="text" v-model="credentials.admin" class="form-control">
        </div>
        <div class="form-group">
            <label for="user">Contraseña</label>
            <input type="password" v-model="credentials.password" class="form-control">
        </div>
        <div v-if="error.title" class="alert alert-danger" role="alert"><strong>{{error.title}}</strong> {{error.message}}</div> 
        <button class="btn btn-primary">Ingresar</button>
        <Spinner class="mt-2" v-if="logging_in"/>
    </form>
  </div>
</template>

<script>
import Spinner from '../global/Spinner';
export default {
    name: 'Login',
    components:{Spinner},
    data: function() {
        return {
            credentials:{
                admin:null,
                password:null,
            },
            error:{
                title:null,
                message:null,
            },
            logging_in:false,
            
        }
    },
    methods: {
        login() {
            let credentials = {
                email:this.credentials.admin,
                password:this.credentials.password,
            }
            this.logging_in = true;
            this.$store.dispatch('authentication/login',credentials)
            .then((response) => {
                this.logging_in = false;
                if(response.level == 'Admin'){
                this.$store.dispatch('ini');
                this.$router.push('/');
                
                }else if(response == 'network-issue') {
                    this.error = {
                        title: 'Error!',
                        message: 'Problemas con la conexión a internet.'
                    }   

                }else{
                    this.error = {
                        title: 'Error!',
                        message: 'Credenciales incorrectas.'
                    }   
                }

            })
                
           
            

            
        }
    }
}
</script>

<style>

</style>