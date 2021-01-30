<template>
  <registerbox ></registerbox>
</template>

<script>
import registerbox from "~/components/RegisterBox";

export default {
  layout:'auth',
  name: "Register",
  middleware: 'loggedIn',
  head() {
    return {
      title: "Matcha - Register",
    };
  },
  data(){
    return{
    status: this.$store.state.auth.loggedIn
    }
  },
  components: {
    registerbox,
  },
};
</script>
<style>
</style>