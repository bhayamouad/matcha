import Cookies from 'js-cookie'
export default async function({$axios, redirect, route}){
    const accTok = Cookies.get('accTok')
    const refTok = Cookies.get('refTok')
    if(accTok && refTok){
    const tokens = {accTok, refTok}
    const ret = await $axios.post('/account/authorization', tokens);
    

    if(ret.data.state == 'AUTHORIZED')
        redirect('/home')
    }
    // console.log(route.path)
}