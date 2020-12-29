export default async function({store, $axios, redirect}){
    store.commit('auth/init')
    const accTok = store.state.auth.accToken
    const refTok = store.state.auth.refToken
    const tokens = {accTok, refTok}
    const ret = await $axios.post('/account/authorization', tokens);

    if(ret.data.state != 'AUTHORIZED')
        redirect('/')
}