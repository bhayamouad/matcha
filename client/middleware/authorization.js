export default async function({store, $axios}){
    const ret = await $axios.post('/account/authorization');
    if(ret.data.state == 'AUTHORIZED')
        store.commit('auth/logIn')
    else
        store.commit('auth/logOut')
}