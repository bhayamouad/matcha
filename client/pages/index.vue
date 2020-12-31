<template>
  <div>
    <loginbox v-if="!status"></loginbox>
    <home v-if="status" />
  </div>

</template>

<script>
import loginbox from "~/components/LoginBox";
import home from "~/components/Home";


export default {
  layout: 'auth',
  name: "HomePage",
  data(){
    if(this.$store.state.auth.loggedIn)
      this.$nuxt.setLayout('home');
    return{
    status: this.$store.state.auth.loggedIn
    }
  },
  components: {
    loginbox,
    home
  },
  head() {
    return {
      title: "Matcha - Welcome",
    };
  },
};
</script>
<style src="@/style/homepage.css">
</style>
