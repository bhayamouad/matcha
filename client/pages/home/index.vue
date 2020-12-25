<template>
  <div>hello from home {{theret}}</div>
</template>

<script>
import Cookies from 'js-cookie'
// import { mapMutations } from 'vuex'

export default {
  computed: {
    theret(){
      return this.$store.state.auth.accToken;
    }
  },
  middleware: 'authorization',
  name: "HomePage",
  // data(){
  //   return{
  //     test: Cookies.get('refTok')
  //   }
  // },
  head() {
    return {
      title: "Matcha",
    };
    
  },
};
</script>
<style src="@/style/homepage.css">
</style>
