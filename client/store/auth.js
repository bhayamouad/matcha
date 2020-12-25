const state = ()=> ({
    loggedIn: false,
    accToken: null,
    refToken: null
})

const mutations = {
    logIn(state, accToken, refToken){
        state.loggedIn = true
        state.accToken = accToken
        state.refToken = refToken
    },
    logOut(state){
        state.loggedIn = false
        state.accToken = null
        state.refToken = null
    }
}



// const getters = {
//     isLoggedIn(state){
//         return state.loggedIn
//     },
//     getAccToken(state){
//         return state.accToken
//     }
// }

export default {
    state,
    mutations
}