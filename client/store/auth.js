import Cookies from 'js-cookie'
const state = ()=> ({
    loggedIn: false,
    accToken: null,
    refToken: null
})
const mutations = {
    logIn(state, ret){
        state.loggedIn = true
        state.accToken = ret.accTok
        state.refToken = ret.refTok
        Cookies.set('accTok', ret.accTok)
        Cookies.set('refTok', ret.refTok)
    },
    logOut(state){
        state.loggedIn = false
        state.accToken = null
        state.refToken = null
    },
    init(state){
        const acc = Cookies.get('accTok');
        const ref = Cookies.get('refTok')
        if(ref && acc)
        {
            state.accToken = acc
            state.refToken = ref
        }
    }
}

export default {
    state,
    mutations
}