<template>
    <div v-if="product">
        <form @submit.prevent="editProduct">
            <div class="form-group">
                <label for="name">Nombre</label>
                <input type="text" class="form-control" id="name" v-model="product.name" required>
                <div 
                v-if="errors.name"
                class="alert alert-danger" role="alert">
                {{errors.name}}
                </div>
            </div>
            <div class="form-group">
                <label for="description">Descripción</label>
                <textarea class="form-control" id="description" cols="30" rows="4" v-model="product.description" required></textarea>
                <div 
                v-if="errors.description"
                class="alert alert-danger" role="alert">
                {{errors.description}}
                </div>
            </div>
            <div class="form-group">
                <label for="category_id">Categoría</label>
                <SelectProductCategories @category="updateCategory"/>
            </div>
            <div class="form-group">
                <label for="price">Precio</label>
                <input type="number" class="form-control" id="price" v-model="product.price" required>
                <div 
                v-if="errors.price"
                class="alert alert-danger" role="alert">
                {{errors.price}}
                </div>
            </div>
            <div class="form-group">
                <label for="category_id">Ya se encuentra a la venta?</label>
                <SelectProductSellable @sellable="updateSellable"/>
            </div>
            <div class="form-group">
                <label for="picture">Imagen</label>
                <input type="file" class="form-control" id="picture" @change="selectedPicture">
            </div>
            <div class="form-group" v-if="product.picture">
                <label for="actual-picture">Imagen actual</label>
                <div id="actual-picture">
                    <img :src="picture" alt="imagen del producto" width="250px">
                </div>
            </div>

            <div>
                <button class="btn btn-block btn-primary">Editar producto</button>
            </div>
        </form>
    </div>
</template>

<script>
import SelectProductCategories from '@/components/products/SelectProductCategories';
import SelectProductSellable from '@/components/products/SelectProductSellable';
export default {
    name:'FormEditProduct',
    components:{
            SelectProductCategories,
            SelectProductSellable
    },
    data: function() {
        return {
            errors:{
                name:null,
                description:null,
                price:null,
                count:0,
            },
            picture:null,
            selected:false
        }
    },
    computed: {
        product() {
           let data =  this.$store.getters['products/byId'](this.$route.params.id);
           if(data){
               return JSON.parse(JSON.stringify(data));
           }
           return false;
        },
    },

    async mounted(){
        if(this.product.picture) {
            let picture = await fetch('http://localhost:8000/api/picture/'+this.$route.params.id, {
                method:'GET',
                credentials:'include',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });

            let response = await picture.blob();
            this.picture = URL.createObjectURL(response);
        }
    },
    
    methods:{

        selectedPicture(e){
            var fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            fileReader.onload = (e) => {
                this.picture = e.target.result;
            }
            this.selected = true;
        },

        validate(){
            this.errors = {
                name:'',
                description:'',
                price:null,
                count:0,
            }

            let search = this.$store.getters['products/byName'](this.product.name);
            if(search != null){
                if(search.name != this.product.name){
                    this.errors.name = 'El nombre se encuentra en uso. ';
                    this.errors.count ++;
                }
            }
            
            if(this.product.name.length < 2 ) {
                this.errors.name +='Debe tener un mínimo de 2 caracteres y máximo de 300.'
                this.errors.count ++;
            }

            if(this.product.description.length < 2) {
                this.errors.description = 'La descripción debe contener un mínimo de 2 caracteres y un máximo de 3 mil.';
                this.errors.count ++;

            }

            if(isNaN(this.product.price)) {
                this.errors.price = "Debe ser un número.";
                this.errors.count ++;
            }

            if(this.errors.count > 0) {
                return false;
            }else{
                return true;
            }
        },

        async editProduct() {
            if(!this.validate()){return false}
            if(this.selected == true) {
                this.product.picture = this.picture;
            }else{
                this.product.picture = null;
            }
    
            let edition = await this.$store.dispatch('products/edit',this.product);
        
            if(edition){
                this.$store.commit('SET_NOTIFICATION',{
                    title:'Acción exitosa',
                    message:'El producto fue editado.',
                    bClass: 'success'
                });
            }else{
                this.$store.commit('SET_NOTIFICATION',{
                        title:'Acción rechazada',
                        message:'El producto no pudo ser editado.',
                        bClass: 'danger'
                });
            }
            
        },
        
        updateCategory:function(category) {
            this.product.category_id = category;
        },
        updateSellable:function(option) {
            this.product.sellable = option;
        }
    },
    
}
</script>

<style>

</style>