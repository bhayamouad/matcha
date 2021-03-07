<template>
  <div id="thenav">
    <div id="logo">
      <nuxt-link id="home-link" to="/">
        <img src="@/assets/logo-small.svg" />
      </nuxt-link>
    </div>
    <ul>
      <nuxt-link to="/home">
        <li><i id="uicon" class="fas fa-home"></i>
          <span class="pg-title">Home</span>
        </li>
      </nuxt-link>

    <div :class="{'nolink':nolink}">
      <nuxt-link to="/messages">
        <li>
          <i class="fas fa-envelope">
            <span id="new-messages" :class="{'new-notif': $store.state.notifications.messages}">{{$store.state.notifications.messages}}</span>
          </i>
          <span class="pg-title">Messages</span>
        </li>
      </nuxt-link>
      <nuxt-link to="/notifications">
        <li>
          <i class="fas fa-bell notif">
            <span id="new-notif" :class="{'new-notif': this.$store.state.notifications.notifs}">{{this.$store.state.notifications.notifs}}</span>
          </i>
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
    </ul>
    <div v-on:click="logout" id="logout-btn">
      <span id="lgo-img" :class="{'lgo-img-icon': !loggedUser.profile}">
        <img  v-if="loggedUser.profile" class="profile-img" :src="loggedUser.profile"/>
        <b-icon v-else icon="account" class="profile-img"></b-icon>
      </span>
      <span id="lgo-name">{{loggedUser.name}}</span>
      <span id="lgo-uname">@{{loggedUser.username}}</span>
      <i id="lgo-btn" class="fas fa-sign-out-alt"></i>
    </div>
  </div>
</template>

<script>
import socket from "../socket";
export default {
  data() {
    return {
      loggedUser: {
        name: null,
        username: null,
        profile: null,
        status: null
      },
    isNotif:false,
    nolink: true     
    }
  },
  async fetch() {
    const res = await this.$axios.$get('/account/loggedUser')
    const notif = await this.$axios.get('/matcha/getNewNotification')
    const messages = await this.$axios.get('/matcha/getNewMessages')
    this.$store.commit('notifications/countNotif', parseInt(notif.data.number))
    this.$store.commit('notifications/countMessages', parseInt(messages.data.number))
    this.loggedUser = res.loggedUser
    this.nolink = (this.loggedUser.status>1) ? false : true
    socket.emit("connectUser", this.loggedUser.username)
    socket.on(this.loggedUser.username+"*reconnect", ()=> socket.emit("connectUser", this.loggedUser.username))
    socket.on("like"+this.loggedUser.username, () => this.$store.commit('notifications/addNewNotif') )
    socket.on("dislike"+this.loggedUser.username, () => this.$store.commit('notifications/addNewNotif'))
    socket.on("match1"+this.loggedUser.username, () => this.$store.commit('notifications/addNewNotif'))
    socket.on("match2"+this.loggedUser.username, () => this.$store.commit('notifications/addNewNotif'))
    socket.on("visit"+this.loggedUser.username, () => this.$store.commit('notifications/addNewNotif'))
    socket.on("msgNotif"+this.loggedUser.username, async ( users ) => {
      if(this.$route.params.inbox !== users.from){
        await this.$axios.$put("/matcha/setMessageStatus", {status: 0, profile: users.from})
        this.$store.commit('notifications/addNewMessage')
      }
    })
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