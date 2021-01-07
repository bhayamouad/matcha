<template>
  <div>
    <loginbox v-if="!loggedIn"></loginbox>
    <home v-if="loggedIn" />
  </div>

</template>

<script>
import loginbox from "~/components/LoginBox";
import home from "~/components/Home";


export default {
  layout: 'auth',
  name: "HomePage",
  beforeCreate(){
    if(this.$store.state.auth.loggedIn)
      this.$nuxt.setLayout('home');
  },
  data(){
    return{
    loggedIn: this.$store.state.auth.loggedIn
    }
  },
  components: {
    loginbox,
    home
  },
};
</script>
<style src="@/style/homepage.css">
</style>
