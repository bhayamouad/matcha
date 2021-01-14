<template>
  <div id="thenav">
      <div id="logo"><a id="home-link" href="/"> <img src="@/assets/logo-small.svg"></a></div>
     <ul>
         <a href="#Home"><li><i class="fas fa-home"></i><span class="pg-title">Home</span></li></a>
         <a href="#Messages"><li><i class="fas fa-envelope"></i><span class="pg-title">Messages</span></li></a>
         <a href="#Notifications"><li><i class="fas fa-bell"></i><span class="pg-title">Notifications</span></li></a>
          <a href="#Profile"><li><i class="fas fa-user"></i><span class="pg-title">Profile</span></li></a>
         <a href="#Settings"><li><i class="fas fa-cog"></i><span class="pg-title">Settings</span></li></a>
     </ul>
     <div v-on:click="logout" id="logout-btn">
       <img id="profile-img" src="https://pbs.twimg.com/profile_images/1042933103826792448/yXkil7tc_400x400.jpg">
       <span id="lgo-name" >Anas Benani</span>
       <span  id="lgo-uname">@benanianas</span>
       <i  id="lgo-btn" class="fas fa-sign-out-alt"></i>
     </div>
  </div>
  
</template>

<script>
export default {
  methods: {
      async logout()
      {
          const res = await this.$axios.get('/account/logout')
          this.$store.commit('auth/logOut')
          this.$router.go()
      }
  },

}
</script>

<style src="@/style/sidenav.scss" lang="scss">

</style>