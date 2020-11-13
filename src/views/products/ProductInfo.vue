<template>
  <div class="container my-3" v-if="product">
      <Modal
      :title="modalData.title"
      :body="modalData.body"
      @accept="deleteItem"
      />
      <header>
        <h1>{{product.name}}</h1>
        <hr>
      </header>
      <main>
          <img :src="picture" alt="imagen" v-if="product.picture" width="400px">
          <p><strong><i>{{product.category.name}}</i></strong></p>
          <p>{{product.description}}</p>
          <p>Precio: ${{product.price}} ARS</p>
          <p v-if="product.sellable">Producto a la venta.</p>
          <p v-else>(El producto <strong>NO</strong> se encuentra a la venta).</p>
          <DeleteButton
          @delete="confirmAction"
          bClass="danger"
          title="Eliminar producto"
          />
          <EditButton
          @edit="editItem"
          bClass="secondary"
          title="Editar producto"
          />
      </main>
  </div>
</template>

<script>
import DeleteButton from '@/components/global/DeleteButton';
import EditButton from '@/components/global/EditButton';
import Modal from '@/components/global/Modal';
export default {
    name:'ProductInfo',
    components: {DeleteButton,EditButton, Modal},
    data:function(){
        return {
            modal:{
                title:null,
                body:null,
            },
            picture:null,
        }
    },
    computed: {
        product() {
            return this.$store.getters['products/byId'](this.$route.params.id);
        },
        modalData() {
            return this.modal;
        },

    },
   async mounted(){
        let picture = await fetch('http://localhost:8000/api/picture/'+this.$route.params.id, {
            method:'GET',
            credentials:'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        });

        let response = await picture.blob();
        this.picture = URL.createObjectURL(response);
        
        
    
       
    },
    methods: {

        confirmAction() {
            this.modal.title = 'Atencion!';
            this.modal.body = 'Estas por eliminar el producto: '+ this.product.name +'. Deseas continuar?';
            this.$bvModal.show('modal');

        },

        editItem() {
            this.$router.push('/product/'+ this.$route.params.id+'/edit');
        },
       async deleteItem() {
            let deleted= await this.$store.dispatch('products/delete',this.$route.params.id);
            
            if(deleted.product) {
                this.$router.push('/products').then(()=>{
                    let arrayProducts = this.$store.getters['products/list'];
                    
                    arrayProducts.forEach( (item,index) => {
                        if(item.id == deleted.product.id) {
                            arrayProducts.splice(index,1);
                            this.$store.commit('products/SET_LIST',arrayProducts);
                            return true;
                        }
                    });

                    this.$store.commit('SET_NOTIFICATION',{
                            title:'Acción exitosa',
                            message:'El producto '+ deleted.product.name +' fue eliminado.',
                            bClass:'success',
                    });
                });


            }else{
                this.$store.commit('SET_NOTIFICATION',{
                            title:'Acción rechazada',
                            message:'El producto '+ this.product.name +' no pudo ser eliminado.',
                            bClass:'danger',
                });
            }

            this.modal.title  = null;
            this.modal.body   = null;
            

        }
            
        
    }
}
</script>

<style>

</style>