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
    if(this.$route.params.authsrc == 'google')
    {
        if (this.$route.query.code)
        {
        const res = await this.$axios.$post('/account/oauth/google', {code : this.$route.query.code})
        }
        else{
        this.$router.push('/')
        }
    }
    else if(this.$route.params.authsrc == 'facebook')
    {
        if (this.$route.query.code)
        {
          const res = await this.$axios.$post('/account/oauth/facebook', {code : this.$route.query.code})
        }
        else{
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