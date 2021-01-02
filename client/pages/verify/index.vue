<template>
  <verifyBox v-if="!status"/>
</template>

<script>
import verifyBox from "@/components/VerifyEmail"

export default {
  layout:'auth',
  middleware: 'loggedIn',
  name: "VerifyEmail",
  components: {
    verifyBox
  },
  data(){
    return{
    status: this.$store.state.auth.loggedIn
    }
  }
}
</script>
<style src="@/style/homepage.css">
</style>