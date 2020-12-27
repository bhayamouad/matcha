import Cookies from 'js-cookie'
export default function({store, $axios}){
    // const ret = await $axios.post('/account/authorization');
    console.log(store.state.auth.accToken)
}