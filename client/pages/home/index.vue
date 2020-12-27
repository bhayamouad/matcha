<template>
  <div>hello from home {{theret}}  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { mapMutations } from 'vuex'

export default {
  computed: {
    theret(){
      return this.$store.state.auth.loggedIn;
    }
  },
  // asyncData({$axios, store,redirect}){
  //   const accTok = store.state.auth.accToken
  //   const refTok = store.state.auth.refToken
  //   const tokens = {accTok, refTok}
  //   // const res = await $axios.$post(`/account/authorization`, tokens)    
  //   // console.log(res)
  //   console.log(store.state.auth.refToken)

  // },
  beforeCreate(){
    this.$store.commit('auth/init')
  },
  name: "HomePage",
  head() {
    return {
      title: "Matcha",
    };
    
  },
};
</script>
<style src="@/style/homepage.css">
</style>
