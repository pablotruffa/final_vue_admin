<template>
  <div>
      <table class="table table-responsive">
          <thead class="thead-dark">
              <tr>
                  <th>Habitación</th>
                  <th>Password</th>
                  <th>Estado</th>
              </tr>
          </thead>
          <tbody>
              <ClientRow v-for="client in clients" :key="client.id" :client="client"/>
          </tbody>
      </table>
  </div>
</template>

<script>
import ClientRow from '@/components/clients/ClientRow';
import { fstore } from '@/firestore/firestore';
export default {
    name:'ClientList',
    components:{ClientRow},
    data:function(){
        return {
            cloud:{
                clients:[],
                ref:null,
            },
        }
    },
    computed:{

        clients() {
            return this.$store.getters['clients/list'];
        },
        laravelClients() {
            let laravelClients = [];
            this.clients.forEach(client => {
                laravelClients.push(client);
            });
            return laravelClients;
        },
        laravelClientEmails() {
            let emails = [];
            this.clients.forEach(client => {
                emails.push(client.email);
            });
            return emails;
        },
        firebaseClients() {
            return this.cloud.clients;
        },
        
        clientsToUpload() {
            let clientsToUpload = [];

            this.laravelClients.forEach(client => {
                if(!this.firebaseClients.includes(client.email) && client.deleted_at == null ) {
                    clientsToUpload.push(client.email);
                }
            });
            return clientsToUpload;
        },

        clientsToDelete(){
           let clientsToDelete = []; 
           //Clientes que figuran en firebase y no estan en laravel vuelan...
           this.firebaseClients.forEach(client => {
               if(!this.laravelClientEmails.includes(client)) {
                   clientsToDelete.push(client);
               }
           });
           //Clientes que esten en laravel con la propiedad deleted_at vuelan...
           this.laravelClients.forEach(client =>{
               if(client.deleted_at) {
                   clientsToDelete.push(client.email);
               }
           });

           return clientsToDelete;
        }
       
    },
    created(){
        this.cloud.ref = fstore.collection("clients");
        this.cloud.ref.onSnapshot(snapshot => {
            let data = [];
            snapshot.forEach(doc => {
                data.push(doc.id);
            });
            this.cloud.clients = data;
        });
        
    },
    methods:{
        deleteCloudClient(client) {
            
            fstore.collection('clients').doc(client).delete()
            .then(function(){
                console.log(`Client ${client} deleted successfully.`);
            }).catch(function(error){
                console.log(error);
            });
            
        },

        uploadCloudClient(client) {
            fstore.collection('clients').doc(client).set({
                email:client,
            })
            .then(function(){
                console.log(`Client ${client} uploaded successfully.`);
            }).catch(function(error){
                console.log(error);
            });
        }
        
    },
    
    watch:{
        clientsToDelete:function(clients) {
            if(clients.length > 0){
                this.deleteCloudClient(clients[0]);
            }
        },
        clientsToUpload:function(clients) {
            if(clients.length > 0){
                this.uploadCloudClient(clients[0]);
            }
        }
    }

}
</script>

<style>

</style>