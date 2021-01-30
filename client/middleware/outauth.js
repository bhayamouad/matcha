export default async function({$axios, redirect}){
    const ret = await $axios.post('/account/authorization');
    if(ret.data.state == 'AUTHORIZED')
    {
        redirect('/home')
    }
}