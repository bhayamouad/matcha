const state = () => ({
    notifs: null,
    messages: null,
  })
  
const mutations = {
    countNotif(state, arg){
        state.notifs = ( arg > 0 ) ? arg : null
    },
    countMessages(state, arg){
        state.messages = (arg>0) ? arg : null
    },
    addNewNotif(state){
        state.notifs = (state.notifs) ? state.notifs + 1 : 1
    },
    addNewMessage(state){
        state.messages = (state.messages) ? state.messages + 1 : 1
    },
    clearNotifs(state){
        state.notifs = null
    },
    clearMessages(state){
        state.messages = (state.messages && state.messages - 1 > 0) ? state.messages - 1: null
    }

  }

export default{
  state,
  mutations
}