const state = () => ({
    list: []
  })
  
const mutations = {
    add(state, toast) {
      state.list.push(toast)
    },
    clear(state) {
      for(let elm of state.list)
        elm()
      state.list = []
    },
  }

export default{
  state,
  mutations
}