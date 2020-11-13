<template>
  <div class="container mt-3" v-if="client">
      <Modal
      :title="modal.title"
      :body="modal.body"
      @accept="confirmAction"
      />
      <header>
          <h1>Habitación: {{client.room_number}}</h1><hr>
      </header>
      <main>
          <div v-if="client.deleted_at">
             <p>El cliente {{client.room_number}} se encuentra desactivado.<br>Esto implica que no podrá iniciar sesión ni realizar pedidos.</p>
             <div>
                 <button class="btn btn-primary" @click="launchModal">Activar</button>
                 <button class="btn btn-danger ml-2" @click="launchKillModal">Eliminar!</button>
             </div>
          </div>
          <div v-else>
             <p>El cliente {{client.room_number}} se encuentra activo.<br>Puede iniciar sesión y realizar pedidos.</p>
             <div>
                 <button class="btn btn-danger" @click="launchModal">Desactivar</button>
                 <button class="btn btn-danger ml-2" @click="launchKillModal">Eliminar!</button>
            </div>
          </div>
          <hr>
      </main>
  </div>
</template>

<script>
import { fstore } from '@/firestore/firestore';
import Modal from '@/components/global/Modal';
export default {
    name:'ClientInfo',
    components: {Modal},
    data:function() {
        return {
            modal:{
                title:null,
                body:null,
            },
        }
    },
    computed: {
        client() {
            return this.$store.getters['clients/byId'](this.$route.params.id);
        },
    },
    methods: {

        launchModal() {
            if(this.client.deleted_at){
                this.modal.title = 'Reactivar'; 
                this.modal.body = `Estas por activar al cliente ${this.client.room_number}. Deseas continuar?`;
            }else{
                this.modal.title = 'Desactivar'; 
                this.modal.body = `Estas por desactivar al cliente ${this.client.room_number}. Deseas continuar?`;
            }
            this.$bvModal.show('modal');
        },

        launchKillModal(){
            this.modal.title = 'Eliminar'; 
            this.modal.body = `Estas por eliminar al cliente ${this.client.room_number}. Este paso no tiene vuelta atras, deseas continuar?`;
            this.$bvModal.show('modal');
        },
        confirmAction() {
             if(this.modal.title == 'Eliminar' ){
                 this.kill();
             }else{
                 this.client.deleted_at ? this.restore() : this.delete();
             }
        },

        async delete() {
            let id = this.$route.params.id;
            let deleted = await this.$store.dispatch('clients/delete',id);
            
            if(deleted) {
                
                let clients = this.$store.getters['clients/list'];
                clients.forEach((client,index) => {
                    if(client.id == deleted.client.id) {
                        clients.splice(index,1,deleted.client);
                    }
                });

                fstore.collection('clients').doc(deleted.client.email).delete()
                .then(function(){
                    console.log(`Client ${deleted.client.email} deleted successfully.`);
                }).catch(function(error){
                    console.log(error);
                });



                this.$store.commit('clients/SET_LIST',clients);
                this.$store.commit('SET_NOTIFICATION',{
                    title:'Acción exitosa',
                    message:`El cliente #${deleted.client.room_number} se encuentra desactivado.`,
                    bClass:'success',
                });


            }else{
                this.$store.commit('SET_NOTIFICATION',{
                    title:'Error',
                    message:`El cliente #${deleted.client.room_number} no pudo ser desactivado.`,
                    bClass:'danger',
                });
            }
        },
        async restore() {
            let id = this.$route.params.id;
            let restored = await this.$store.dispatch('clients/restore',id);
            if(restored) {
                let clients = this.$store.getters['clients/list'];
                clients.forEach((client,index) => {
                    if(client.id == restored.client.id) {
                        clients.splice(index,1,restored.client);
                    }
                });

                fstore.collection('clients').doc(restored.client.email).set({
                    email:restored.client.email,
                })
                .then(function(){
                    console.log(`Client ${restored.client.email} restored successfully.`);
                }).catch(function(error){
                    console.log(error);
                });

                this.$store.commit('clients/SET_LIST',clients);
                this.$store.commit('SET_NOTIFICATION',{
                    title:'Acción exitosa',
                    message:`El cliente #${restored.client.room_number} se encuentra reactivado.`,
                    bClass:'success',
                });
            }else{
                this.$store.commit('SET_NOTIFICATION',{
                    title:'Error',
                    message:`El cliente #${restored.client.room_number} no pudo ser reactivado.`,
                    bClass:'danger',
                });
            }
        },

        async kill () {
            let id = this.$route.params.id;
            let killed = await this.$store.dispatch('clients/kill',id);
            if(killed) {
                let clients = this.$store.getters['clients/list'];
                clients.forEach((client,index) => {
                    if(client.id == killed.client.id) {
                        clients.splice(index,1);
                    }
                });

                fstore.collection('clients').doc(killed.client.email).delete();
        
                killed.notificationsToDelete.forEach( trace =>{
                    trace = ''+trace;
                fstore.collection('notifications').doc(trace).delete();
                fstore.collection('orders').doc(killed.client.email)
                .collection('bag').doc(trace).delete();
                });
                fstore.collection('orders').doc(killed.client.email).delete();
                
                this.$store.commit('clients/SET_LIST',clients);
                this.$router.push('/clients').then(()=>{

                    this.$store.commit('SET_NOTIFICATION',{
                        title:'Acción exitosa',
                        message:`El cliente #${killed.client.room_number} se encuentra eliminado.`,
                        bClass:'success',
                    });
                });

            }
        }
       
    },
}
</script>

<style>

</style>