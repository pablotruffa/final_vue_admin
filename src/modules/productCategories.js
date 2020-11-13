export default {
    namespaced:true,
    state:{
        list:[],
        isFetching:false,
        isUploading:false,
        isDeleting:false,
    },
    
    getters:{
        api: (state, getters, rootState) => {
            return rootState.api_route;
        },
        list: (state) => {
            return state.list;
        },
    },

    mutations:{
        FETCHING(state, status) {
            state.isFetching = status;
        },
        SET_LIST(state, payload) {
            state.list = payload;
        },
    },

    actions:{
        async get(context) {
            try {
                context.commit('FETCHING',true);
                let categories = await fetch(context.getters.api + '/product-categories',{
                    method:'GET',
                    credentials:'include',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                });
                let response = await categories.json();
                context.commit('SET_LIST',response);
                context.commit('FETCHING',false);
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
            
        }
    },
}