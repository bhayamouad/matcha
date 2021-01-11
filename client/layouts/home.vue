<template>
  <div>
    <sidenav></sidenav>
    <nuxt id="content"/>
  </div>
</template>

<script>
import Sidenav from "~/components/SideNav";
export default {
  middleware: 'authorization',
  components: {Sidenav},
  head() {
  return {
    title: "Matcha",
  };
  },
  methods: {
      async logoutnow()
      {
          const res = await this.$axios.get('/account/logout')
          this.$store.commit('auth/logOut')
          this.$router.go()
      }
  },
  data(){
    return{
    status: this.$store.state.auth.loggedIn
    }
  }
}
</script>

<style src="@/style/homeLayout.css">

</style>