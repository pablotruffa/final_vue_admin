import { fauth } from '../firestore/firestore';
export default {
    namespaced: true,
    state:{
        isLogginIn:false,
        isLogginOut:false,
        admin: {
            id:null,
            email:null
        }
    },

    getters:{
        api: (state, getters, rootState) => {
            return rootState.api_route;
        },
    },

    mutations:{
        LOGGIN_IN(state,bool) {
            state.isLogginIn = bool;
        },
        LOGGING_OUT(state,bool) {
            state.isLogginOut = bool;
        },
        SET_ADMIN(state, payload) {
            state.admin = payload
        },
    },

    actions:{
        async login(context,adminCredentials ) {
            
                try {
                    context.commit('LOGGIN_IN',true);
                    const laravelAuth = await fetch(context.getters.api + '/admin-login',{
                        method:'POST',
                        credentials:'include',
                        body:JSON.stringify(adminCredentials),
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        }
                    }).then(res => res.json());
                    
                    await fauth.signInWithEmailAndPassword(adminCredentials.email, adminCredentials.password).catch(function(error) {
                        // Handle Errors here.
                        var errorMessage = error.message;
                        console.log(errorMessage);
                        // ...
                    });
                   
                   
                    if(laravelAuth.status == 'logged-in' && fauth.currentUser.email === laravelAuth.email ) {
                        context.commit('SET_ADMIN',{
                            id:laravelAuth.id,
                            email:laravelAuth.email,
                        });
                        context.commit('SET_AUTH',{
                            logged:true,
                            level:laravelAuth.level
                        },{root:true});
                        return laravelAuth;
                    }else if(laravelAuth.status == 'logged-in' && fauth.currentUser == null) {
                        return 'network-issue';
                    }else{
                        return false;
                    }
                    
                } catch (error) {
                    console.log(error);
                }  
            
        },
        
        async logout(context) {
            context.commit('LOGGING_OUT',true);
            try {
                const outLarvel = await fetch(context.getters.api + '/admin-logout',{
                    method:'POST',
                    credentials:'include',
                    headers:{
                        'X-Requested-With':'XMLHttpRequest'
                    }
                    
                }).then(res => res.json());;

                await fauth.signOut();
                
                if(outLarvel.status == 'logged-out') {
                    context.commit('LOGGING_OUT',false);
                    context.commit('SET_ADMIN',{
                        id:null,
                        email:null,
                    });
                    context.commit('SET_AUTH',{
                        logged:false,
                        level:null,
                    },{root:true});

                    return true;
                }else{
                    return false;
                }
            } catch (error) {
                console.log(error);
                return false;
            }
           
            
        }
    },

}