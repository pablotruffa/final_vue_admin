export default {
    namespaced:true,
    state:{
        list:[],
        isFetching:false,
        isUploading:false,
        isEditing:false,
        isDeleting:false,
    },
    getters:{
        api: (state, getters, rootState) => {
            return rootState.api_route;
        },
        list: (state) => {
            return state.list;
        },
        byId: (state) => (id) => {
            return state.list.find(product => product.id == id);
        },
        byName: (state) => (name) => {
            let items = state.list;
            return items.find(product => product.name.toLowerCase() == name.toLowerCase());
        },

    },
    mutations:{
        FETCHING(state, bool) {
            state.isFetching = bool;
        },
        SET_LIST(state, payload) {
            state.list = payload;
        },
        ADD_TO_LIST(state, payload) {
            state.list.push(payload);
        },
        EDIT_LIST(state, payload) {
            state.list = payload;
        },
        DELETING(state, bool) {
            state.isDeleting = bool;
        },
        UPLOADING(state, bool) {
            state.isUploading = bool;
        },
        EDITING(state, bool) {
            state.isEditing = bool;
        },
    },
    actions:{
        async get(context) {
          try {
            context.commit('FETCHING', true);
            let products = await fetch(context.getters.api + '/products',{
              method:'GET',
              credentials:'include',
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
              }
            });
            let productsToJson = await products.json();
            context.commit('FETCHING', false);
            context.commit('SET_LIST', productsToJson);
            return true;
          
          } catch (error) {
            console.log(error);  
            return false;
          }
        },

        async create(context,product) {
          try {
            context.commit('UPLOADING',true);
            let creation = await fetch(context.getters.api + '/product',{
              method:'POST',
              credentials: 'include',    
              body: JSON.stringify(product),
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
              }
            });

            let response = await creation.json();
            context.commit('UPLOADING',false);
            if(response.errors){
              return false;
            }
            console.log(response);
            context.commit('ADD_TO_LIST',response.product);
            return true;
            
          } catch (error) {
              console.log(error);
              return false; 
          }
        },
        
        async edit(context,product){
          try {
            context.commit('EDITING',true);
            let edition = await fetch(context.getters.api + '/product/'+ product.id,{
              method:'PUT',
              credentials: 'include',    
              body: JSON.stringify(product),
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
              }
            });

            let response = await edition.json();
          
            context.commit('EDITING',false);

            if(response.errors){
              return false;
            }
            //Commit mutation edit list
            let products = context.state.list;
            
            
            products.forEach((item,index) => {
              if(item.id == product.id){
                products.splice(index,1,response.product);
                return true;
              }
            });

            context.commit('EDIT_LIST', products);
            return true;

          } catch (error) {
              console.log(error);
              return false; 
          }

        },

          async delete(context,id) {

            try {
              context.commit('DELETING',true);
              let deletion = await fetch(context.getters.api + '/product/'+ id, {
                method:'DELETE',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest',
                }
              });

              let response = await deletion.json();
              if(response.status == 'deleted') {
                return response;
              }
              return false;

            } catch (error) {
              console.log(error);
              return false; 
            }
          },
    },
}