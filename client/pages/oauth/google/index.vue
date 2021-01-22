<template>
  <div>
      Google Callback
  </div>
</template>

<script>
export default {
  async beforeCreate(){
    if (this.$route.query.code)
    {
      const res = await this.$axios.$post('/account/oauth/google', {code : this.$route.query.code})
    }
    else{
      this.$router.push('/')
    }

  }

}
</script>

<style>

</style>