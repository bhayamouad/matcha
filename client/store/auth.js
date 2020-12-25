const state = ()=> ({
    loggedIn: false,
    accToken: null
})

const mutations = {
    logIn(state, accToken){
        state.loggedIn = true
        state.accToken = accToken
    },
    logOut(state){
        state.loggedIn = false
        state.accToken = null
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