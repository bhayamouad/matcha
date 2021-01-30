<template>
  <resetBox ></resetBox>
</template>

<script>
import resetBox from "@/components/ResetPassword"

export default {
  layout:'auth',
  name: "ResetPassword",
  middleware: 'loggedIn',
  components: {
    resetBox,
  },
  head() {
    return {
      title: "Matcha - Reset Password",
    };
  },
  data(){
    return{
    status: this.$store.state.auth.loggedIn
    }
  },
}
</script>
<style>
</style>