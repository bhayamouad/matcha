import Cookies from 'js-cookie'
const state = ()=> ({
    loggedIn: false,
    accToken: null,
    refToken: null
})
const mutations = {
    logIn(state, ret){
        state.loggedIn = true
        // state.accToken = ret.accTok
        // state.refToken = ret.refTok
        // Cookies.set('accTok', ret.accTok)
        // Cookies.set('refTok', ret.refTok, {expires: 3 }) //3days
    },
    // setAccTok(state,token){
    //     state.loggedIn = true
    //     state.accTok = token
    //     Cookies.set('accTok', token, {expires: 3 })
    // },
    logOut(state){
        state.loggedIn = false
        // state.accToken = null
        // state.refToken = null
        // Cookies.remove('accTok')
        // Cookies.remove('refTok')
    },
    status(state, status){
        state.loggedIn = status
    },
    // init(state){
    //     const acc = Cookies.get('accTok');
    //     const ref = Cookies.get('refTok')
    //     if(ref)
    //     {
    //         if(acc)
    //             state.accToken = acc
    //         state.refToken = ref
    //     }
    // }
}

export default {
    state,
    mutations
}