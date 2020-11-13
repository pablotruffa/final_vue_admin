import { secondaryApp } from '../firestore/firestore';
export default {
    namespaced:true,
    state:{
        list:[],
        isFetching:false,
        isUploading:false,
        isEditing:false,
        isDeleting:false,
        isRestoring:false,
        isKilling:false,
    },
    getters:{
        api: (state, getters, rootState) => {
            return rootState.api_route;
        },
        list: (state) => {
            let list = state.list;
            list.sort(function(a,b){
              return a.room_number - b.room_number
            });
            return list;
        },
        byId: (state) => (id) => {
            return state.list.find(client => client.id == id);
        },
        byRoomNumber: (state) => (number) => {
            let items = state.list;
            return items.find(client => client.room_number == number);
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
        KILLING(state, bool) {
            state.isKilling = bool;
        },
        RESTORING(state, bool) {
            state.isRestoring = bool;
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
              let clients = await fetch(context.getters.api + '/clients',{
                method:'GET',
                credentials:'include',
                headers: {
                'X-Requested-With': 'XMLHttpRequest',
                }
              });
              let list = await clients.json();
              context.commit('FETCHING', false);
              context.commit('SET_LIST', list);
              return true;
            
            } catch (error) {
              console.log(error);  
              return false;
            }
          },
        
          async create(context,client) {
            try {
              context.commit('UPLOADING',true);
              let creation = await fetch(context.getters.api + '/client',{
                method:'POST',
                credentials: 'include',    
                body: JSON.stringify(client),
                headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest',
                }
              });
              let response = await creation.json();
              if(!response.errors){
                context.commit('ADD_TO_LIST',response.client);              
                context.commit('UPLOADING',false);
                
                //REGISTRAR EN FIRESTORE....
                secondaryApp.auth().createUserWithEmailAndPassword(client.email, client.password)
                .catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(errorCode,errorMessage);
                  // ...
                });
                
                return true;
              }else{
                context.commit('UPLOADING',false);
                return false;
              }

              
            } catch (error) {
                console.log(error);
                return false; 
            }
          },

          async edit(context,client){
            try {
              context.commit('EDITING',true);
              let edition = await fetch(context.getters.api + '/client/'+ client.id,{
                method:'PUT',
                credentials: 'include',    
                body: JSON.stringify(client),
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
              let clients = context.state.list;
              
              
              clients.forEach((item,index) => {
                if(item.id == client.id){
                  clients.splice(index,1,response.client);
                  return true;
                }
              });
  
              context.commit('EDIT_LIST', clients);
              return true;
  
            } catch (error) {
                console.log(error);
                return false; 
            }
  
          },

          async delete(context,id) {

            try {
              context.commit('DELETING',true);
              let deletion = await fetch(context.getters.api + '/client/'+ id, {
                method:'DELETE',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest',
                }
              });
              
              let response = await deletion.json();
              context.commit('DELETING',false);
              if(response.status == 'deleted') {
                
                return response;
              }
              return false;

            } catch (error) {
              console.log(error);
              return false; 
            }
          },

          async restore(context,id) {
            try {
              context.commit('RESTORING',true);
              let restored = await fetch(context.getters.api + '/client/'+ id, {
                method:'PATCH',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest',
                }
              });
              let response = await restored.json();
              context.commit('RESTORING',false);
              if(response.status == 'restored') {
                return response;
              }
              return false;
              
            } catch (error) {
              console.log(error);
              return false; 
            }
          },
          
          async kill(context,id) {
            try {
              context.commit('KILLING',true);
              let restored = await fetch(context.getters.api + '/client-kill/'+ id, {
                method:'DELETE',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest',
                }
              });
              let response = await restored.json();
              context.commit('KILLING',false);
  
              if(response.status == 'killed') {
                return response;
              }
              console.log(response);
              return false;
            } catch (error) {
              console.log(error);
              return false; 
              
            }
          }


        },

        
}