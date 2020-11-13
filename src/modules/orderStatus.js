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
            return state.list.find(status => status.id == id);
        },
        
    },

    mutations:{
        SET_STATUS_LIST(state,payload) {
            state.list = payload;
        },
    },

    actions:{
        
        async get(context) {
            try {
                const statusList = await fetch(context.getters.api + '/order-status',{
                    method:'GET',
                    credentials:'include',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                      }
                });
                let statusListToJson = await statusList.json();
                context.commit('SET_STATUS_LIST',statusListToJson);
            } catch (error) {
                console.log(error);
                return false;
            }
        }

    },

}