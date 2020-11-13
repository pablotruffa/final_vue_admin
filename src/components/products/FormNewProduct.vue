<template>
    <div>
                <form @submit.prevent="createProduct">
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
                    <div>
                        <button class="btn btn-block btn-primary">Agregar producto</button>
                    </div>
                </form>
            </div>
</template>

<script>
import SelectProductCategories from '@/components/products/SelectProductCategories';
import SelectProductSellable from '@/components/products/SelectProductSellable';
export default {
    name:'FormNewProduct',
    components:{
            SelectProductCategories,
            SelectProductSellable
    },
    data: function() {
        return {
            product:{
                name:null,
                description:null,
                category_id:1,
                price:null,
                sellable:1,
                picture:null,
            },
            errors:{
                name:null,
                description:null,
                price:null,
                count:0,
            },
        }
    },
    methods:{
        selectedPicture(e){
            var fileReader = new FileReader();
            fileReader.readAsDataURL(e.target.files[0]);
            fileReader.onload = (e) => {
                this.product.picture = e.target.result;
            }
        },

        validate(){
            this.errors = {
                name:'',
                description:'',
                price:null,
                count:0,
            }
            
            if(this.$store.getters['products/byName'](this.$data.product.name)) {
                this.errors.name = 'El nombre se encuentra en uso. ';
                this.errors.count ++;
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

        async createProduct() {

            if(!this.validate()){return false}
            let creation = await this.$store.dispatch('products/create',this.$data.product);
            
            if(creation) {
                
                this.product.name           = '';
                this.product.description    = '';
                this.product.category_id    = 1;
                this.product.price          = '';
                this.product.sellable       = 1;
                this.product.picture        = null;
                this.$router.push('/products').then(()=>{
                   this.$store.commit('SET_NOTIFICATION',{
                    title:'Acción exitosa',
                    message:'El producto fue agregado.',
                    bClass: 'success'
                }); 
                });
            }else{
                this.$store.commit('SET_NOTIFICATION',{
                        title:'Acción rechazada',
                        message:'El producto no pudo ser agregado.',
                        bClass: 'danger'
                });
            }
            
        },
        updateCategory:function(category) {
            this.$data.product.category_id = category;
        },
        updateSellable:function(option) {
            this.$data.product.sellable = option;
        }
    }
}
</script>

<style>

</style>