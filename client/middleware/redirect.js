export default async function({$axios, redirect}){
    const ret = await $axios.get('/account/getStatus');
    if(ret.data.status === 1)
        redirect('/home')
}