<template>
  <div id="thenav">
    <div id="logo">
      <a id="home-link" href="/">
        <img src="@/assets/logo-small.svg" />
      </a>
    </div>
    <ul>
      <nuxt-link to="/home">
        <li><i id="uicon" class="fas fa-home"></i>
          <span class="pg-title">Home</span>
        </li>
      </nuxt-link>

    <div v-if="loggedUser.status > 1">
      <nuxt-link to="#Messages">
        <li>
          <i class="fas fa-envelope"></i>
          <span class="pg-title">Messages</span>
        </li>
      </nuxt-link>
      <nuxt-link to="#Notifications">
        <li>
          <i class="fas fa-bell"></i>
          <span class="pg-title">Notifications</span>
        </li>
      </nuxt-link>
      <nuxt-link to="/profile">
        <li>
          <i class="fas fa-user"></i>
          <span class="pg-title">Profile</span>
        </li>
      </nuxt-link>
      <nuxt-link to="/settings">
        <li>
          <i class="fas fa-cog"></i>
          <span class="pg-title">Settings</span>
        </li>
      </nuxt-link>
       <nuxt-link to="/history">
        <li>
          <i class="fas fa-history"></i>
          <span class="pg-title">History</span>
        </li>
      </nuxt-link>
      </div>


      <div class="nolink" v-else>
        <li>
          <i class="fas fa-envelope"></i>
          <span class="pg-title">Messages</span>
        </li>
        <li>
          <i class="fas fa-bell"></i>
          <span class="pg-title">Notifications</span>
        </li>
        <li>
          <i class="fas fa-user"></i>
          <span class="pg-title">Profile</span>
        </li>
        <li>
          <i class="fas fa-cog"></i>
          <span class="pg-title">Settings</span>
        </li>
        <li>
          <i class="fas fa-history"></i>
          <span class="pg-title">History</span>
        </li>
      </div>

      
    </ul>
    <div v-on:click="logout" id="logout-btn">
      <span id="lgo-img" :class="{'lgo-img-icon': !loggedUser.profile}">
        <img  v-if="loggedUser.profile" class="profile-img" :src="loggedUser.profile"/>
        <b-icon v-else icon="account" class="profile-img"></b-icon>
      </span>
      <span id="lgo-name">{{loggedUser.name}}</span>
      <span id="lgo-uname">{{loggedUser.username}}</span>
      <i id="lgo-btn" class="fas fa-sign-out-alt"></i>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loggedUser: {
        name: null,
        username: null,
        profile: null,
      },
      
    }
  },
  async fetch() {
    const res = await this.$axios.$get('/account/loggedUser')
    this.loggedUser = res.loggedUser
  },
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

<style src="@/style/sidenav.css">
</style>