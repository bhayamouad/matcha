<template>
  <resetBox></resetBox>
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
  }
}
</script>
<style src="@/style/homepage.css">
</style>