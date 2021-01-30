<template>
  <div>
      <home id="thehome-content"/>
  </div>
</template>

<script>
import loginbox from "~/components/LoginBox";
import home from "~/components/Home";

export default {
layout: 'home',
  data(){
    return{
    loggedIn: this.$store.state.auth.loggedIn
    }
  },
  components: {home}
}
</script>

<style>
#thehome-content{
    padding-top: 30px;
}
</style>