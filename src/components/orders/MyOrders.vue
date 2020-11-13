<template>
    <div>
        <div v-if="orders.length == 0">
            <p>No se registran pedidos de tus clientes.</p>
        </div>
        <div v-for="order in orders" :key="order.id" class="mb-3 orderCard">
        <b-card :title="'#'+order.trace" sub-title="Detalles">
        <Spinner 
        v-if="ordering.id == order.id && ordering.spin == true"
        class="spinner"
        ref="order.id"
        />
        <b-icon-check-all 
        v-if="ordering.id == order.id && ordering.spin == false"
        class="checked" variant="info"></b-icon-check-all>
        <b-card-text>
            <div v-for="product in order.cart.products" :key="product.id">
                - {{product.name}} x {{product.quantity}}
            </div>
            <div v-if="order.cart.clarification">
                -  Aclaraciones: {{order.cart.clarification}}
            </div>
            <div>
                <p>- <strong>Total:</strong> ${{order.cart.total}} ARS</p>
            </div>
        </b-card-text>
        <p>- Estado:</p>
        <OrderUpdater
        :order_id="order.id"
        :status_id="order.status_id"
        @updateOrder="update"
        />
        <b-card-text v-if="order.status_id == 4 || order.status_id == 5">
            <div><button @click="remove(order)" class="btn btn-primary btn-sm">Quitar del listado.</button></div>
        </b-card-text>
        </b-card>
        </div>
    </div>
</template>

<script>
import OrderUpdater from '@/components/orders/OrderUpdater';
import Spinner from '@/components/global/Spinner';
import { fstore } from '../../firestore/firestore';
export default {
    name:'MyOrders',
    data:function(){
        return {
            ordering:{
                id:null,
                spin:false,
            },
            cloudTraces:[],
        }
    },
    components:{OrderUpdater,Spinner},
    computed: {
        orders() {
            return this.$store.getters['orders/list'];
        },
        localTraces() {
            let traces = [];
            
            this.orders.forEach(order => {
                traces.push(order.trace);
            });
            
            return traces;
        }
    },
    methods:{
        async remove(order) {
            this.ordering.spin = true;
            let response = await this.$store.dispatch('orders/remove',order);
            if(response.status == 'removed') {
                this.ordering.spin = false;
                this.$store.dispatch('orders/get');
            }
        },

        async update(order_id,status_id) {
            this.ordering.id = order_id;
            this.ordering.spin = true;
            let order = {
                id:order_id,
                status:status_id,
            }
            let response = await this.$store.dispatch('orders/update',order);
            if(response.status == 'updated') {
                let orders = this.$store.getters['orders/list'];
                
                orders.forEach(order => {
                    if(order.id == response.order.id) {
                        order.status_id = response.order.status_id;
                        return true;
                    }
                });
                
                this.$store.commit('orders/SET_ORDERS',orders);
                this.ordering.spin = false;
            }
        },

        async loadCloudOrders() {
            if(this.cloudTraces.length > 0 ){
                this.$store.dispatch('orders/get');
            }
        }
    },

    created(){

        fstore.collection('notifications')
            .onSnapshot( snapshot =>{
                let data = [];
                snapshot.forEach(doc => {
                    if(!this.localTraces.includes(parseInt(doc.id))){
                        data.push(parseInt(doc.id));
                    }
                });

                this.cloudTraces = data;
                this.loadCloudOrders();
        });



        
    
    
    
    },




    
}
</script>

<style>
    .orderCard {
        position: relative;
    }

    .spinner{
        position: absolute;
        top:1em;
        right: 1em;
    }

    .checked {
        position: absolute;
        top:.2em;
        right: .2em;
        font-size: 3em;
    }

</style>