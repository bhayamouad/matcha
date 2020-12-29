export default ({store}, inject) => {
    const toast = (buefy, msg, type, duration) =>{
        if(Date.now() - store.state.toasts.time > 250)
            {
            const ref = buefy.toast.open({
                duration: duration,
                message: msg,
                type: type,
            });
            
            const toast = ref.close
            const time = Date.now()
            store.commit('toasts/add', {toast, time})
            }
        }
    const close = ()=>{
        store.commit('toasts/clear')
    }
    
    inject('snoast', {toast, close})
  }