<template>
  <div>
      Facebook Callback
  </div>
</template>

<script>
export default {
  async beforeCreate(){
    const res = await this.$axios.$post('/account/oauth/facebook', {code : this.$route.query.code})
  }
}
</script>

<style>

</style>