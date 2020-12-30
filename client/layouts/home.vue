<template>
<div>
<div style="background-color: red; width: 100%; height: 50px; text-align:center;color: white;"> <h1>Home</h1></div>
<!-- {{status}} -->
  <nuxt />
  </div>
</template>

<script>
export default {
    middleware: ['authorization'],
    // computed:{
    //     status(){
    //         return this.$store.state.auth.loggedIn
    //     }
    // }

}
</script>

<style>

</style>