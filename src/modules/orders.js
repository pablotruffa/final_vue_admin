import { fstore } from '../firestore/firestore';
export default {
    namespaced:true,
    state:{
        list:[],
        isOrdering:false,
    },

    getters:{
        api: (state, getters, rootState) => {
            return rootState.api_route;
        },
        list: (state) => {
            return state.list;
        },
        byId: (state) => (id) => {
            return state.list.find(order => order.id == id);
        },
        
    },

    mutations:{
        ORDERING(state,bool) {
        state.isOrdering = bool;
        },
        SET_ORDERS(state,payload) {
            state.list = payload;
        }
    },

    actions:{
        
        async get(context) {
            try {
                const orders = await fetch(context.getters.api + '/orders',{
                    method:'GET',
                    credentials:'include',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                      }
                });
                let ordersToJson = await orders.json();
                let data = [];
                ordersToJson.orders.forEach(order => {
                    data.push(order);
                });
                context.commit('SET_ORDERS',data);
            } catch (error) {
                console.log(error);
                return false;
            }
        },

        async update(context,order) {

            try {
                const update = await fetch(context.getters.api + `/order/${order.id}`,{
                    method:'PUT',
                    credentials:'include',
                    body:JSON.stringify(order),
                    headers: {
                        'Content-Type':'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                });

                const response = await update.json();
                if (response.error) {
                    return false;
                }else if(response.order) {
                    
                    let trace = ''+response.order.trace;
                    let ref = fstore.collection('orders').doc(response.order.cart.client)
                    .collection('bag').doc(trace);

                    ref.update({
                        updated_at:response.order.updated_at,
                        status:{
                            id:response.order.status.id,
                            name:response.order.status.name,
                            
                        }
                    }).catch((errors)=>{
                        console.log(errors);
                    });

                    
                    return response;
                }

            } catch (error) {
                console.log(error);
                return false
            }

        },

        async remove(context,order) {
            try {
                const remove = await fetch(context.getters.api + `/remove-order/${order.id}`,{
                    method:'PUT',
                    credentials:'include',
                    body:JSON.stringify(order),
                    headers: {
                        'Content-Type':'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                });

                const response = await remove.json();
                if (response.error) {
                    return false;
                }else if(response.order) {
                    
                    let trace = ''+response.order.trace;
                    fstore.collection('orders').doc(response.order.cart.client)
                    .collection('bag').doc(trace).delete()
                    .catch(function(error) {
                        console.error("Error removing document: ", error);
                    });
                    fstore.collection('notifications').doc(trace).delete()
                    .catch(function(error) {
                        console.error("Error removing document: ", error);
                    });
                    
                    return response;
                }

            } catch (error) {
                console.log(error);
            }
        }

    },

}