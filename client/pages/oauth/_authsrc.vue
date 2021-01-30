<template>
  
  <b-loading :is-full-page="true" v-model="isLoading"></b-loading>

</template>

<script>
export default {
  data() {
            return {
                isLoading: true,
            }
  },
 async beforeCreate(){
    if(this.$route.params.authsrc == 'google' && this.$route.query.code)
    {
      const res = await this.$axios.$post('/account/oauth/google', {code : this.$route.query.code})
      if(!res.error)
        this.$router.push('/')
    }
    else if(this.$route.params.authsrc == 'facebook' && this.$route.query.code)
    {
      const res = await this.$axios.$post('/account/oauth/facebook', {code : this.$route.query.code})
      console.log(res.error)
      //need to handle erro ==> snoasts
      if(!res.error)
      {
        this.$store.commit('auth/logIn', true)
        this.$router.push('/')
      }
      else
      {
        this.$router.push('/')
      }
    }
    else{
      this.$router.push('/')
    }

  }
}
</script>

<style>
</style>