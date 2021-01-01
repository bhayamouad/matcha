<template>
<div>
<nav>
<div style="background-color: red; width: 100%; height: 100px; text-align:center;color: white;"> <h1>Home</h1> <br>
<b-button @click="logoutnow" type="is-success" >Logout</b-button><br>
</div>
</nav>
  <nuxt />
  </div>
</template>

<script>
export default {
    middleware: 'authorization',
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
    }

}
</script>

<style>
/* html, body{
    overflow: auto;
} */

</style>