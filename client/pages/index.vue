<template>
  <loginbox v-if="!status"></loginbox>
</template>

<script>
import loginbox from "~/components/LoginBox";

export default {
  layout: 'auth',
  name: "HomePage",
  beforeCreate(){
    if(this.$store.state.auth.loggedIn)
      this.$nuxt.setLayout('home');
  },
  data(){
    return{
    status: this.$store.state.auth.loggedIn
    }
  },
  components: {
    loginbox,
  },
};
</script>
<style src="@/style/homepage.css">
</style>
