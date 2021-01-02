<template>
<div>
  <changePassword v-if="!status"></changePassword>
</div>
</template>

<script>
import changePassword from "@/components/ChangePassword"
export default {
  async beforeCreate() {
     const res = await this.$axios.$get(`/account/reset/${this.$route.params.token}`)
     console.log(res)
    if(res.error)
    { 
      this.$snoast.toast(this.$buefy,res.message,'is-danger')
      this.$router.push('/reset')
    }
  },
  data(){
    return{
    status: this.$store.state.auth.loggedIn
    }
  },
  middleware: 'loggedIn',
  layout:'auth',
  name: "ChangePassword",
  components: {
    changePassword,
  }
}
</script>
<style src="@/style/homepage.css">
</style>
