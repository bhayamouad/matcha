const state = () => ({
    fun: null,
    time: null,
    // beufy: null
  })
  
const mutations = {
    add(state, arg) {
      const call = state.fun
      if (call)
      {
        call()
        state.fun = null
      }
      state.time = arg.time
      state.fun = arg.toast
    },
    clear(state) {
      const call = state.fun
      if (call)
      {
        call()
      }
    },
    // initbeufy(){

    // }
  }

export default{
  state,
  mutations
}