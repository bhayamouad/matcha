const state = () => ({
    fun: null,
    time: null
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
    }
  }

export default{
  state,
  mutations
}




  // const state = () => ({
  //     list: []
  //   })
    
  // const mutations = {
  //     add(state, toast) {
  //       state.list.push(toast)
  //     },
  //     clear(state) {
  //       for(let elm of state.list)
  //         elm()
  //       state.list = []
  //     },
  //   }
  
  // export default{
  //   state,
  //   mutations
  // }