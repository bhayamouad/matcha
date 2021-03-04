<template>
  <section id="profile-sec">
    <div v-if="fetched">
    <div v-if="!data.block && data.user" id="profile-card">
      <div v-if="data.user" id="prf-images">
        <b-carousel v-if="data.user.images" :has-drag="false" :autoplay="false" :repeat="false" animated="fade">
          <b-carousel-item v-for="(image, i) in data.user.images.split(',')" :key="i">
            <section>
              <div class="hero-body has-text-centered">
                <img class="crsl-img" :src="$config.baseURL+'/'+image" />
              </div>
            </section>
          </b-carousel-item>
        </b-carousel>
          <img v-else class="crsl-img" src="@/assets/profile.png" />
        <div id="user-action">
          <i @click="blockUser" v-if="!data.is_me" class="fas fa-ban act-icons"></i>
          <i @click="reportUser" v-if="!data.is_me" class="fas fa-flag act-icons"></i>
          <nuxt-link v-if="data.is_me" to="/settings">
            <i class="fas fa-user-edit act-icons"></i>
          </nuxt-link>
        </div>
        <div v-if="!data.is_me && data.user.images" id="like-bg"><i class="fas fa-heart"></i></div>
        <div v-if="!data.is_me && data.user.images" id="like-act" :class="{'liked':data.liked}" @click="likeButton"><i class="fas fa-heart"></i></div>
      </div>
      <div id="card-info">
        <div id="inf-rt">
        <div class="prf-txts" id="prf-name-cnt">
          <div id="prf-name">{{data.user.fname}} {{data.user.lname}}</div>
          <span
            v-if="data.user.birthdate"
            id="prf-age"
          >, {{moment().diff(data.user.birthdate, 'years')}}</span>
          <i v-if="data.user.gender == 'F'" class="fas fa-venus usr-gender"></i>
          <i v-if="data.user.gender == 'M'" class="fas fa-mars usr-gender"></i>
          <i v-if="data.user.gender == 'O'" class="fas fa-neuter usr-gender"></i>
        </div>
          <div v-if="data.user.rating" id="rating">
            <b-rate
              v-model="rate"
              icon-pack="fas"
              icon="star"
              :max="maxs"
              :size="sizes"
              :spaced="isSpaced"
              :disabled="true"
            ></b-rate>
          </div>
        </div>
        <div v-if="data.user" id="interest">
          <span>Looking For</span>
          <i v-if="data.user.interest == 'F'" class="fas fa-venus usr-int"></i>
          <i v-if="data.user.interest == 'M'" class="fas fa-mars usr-int"></i>
          <i v-if="data.user.interest == 'B'" class="fas fa-venus-mars usr-int"></i>
        </div>
        <div v-if="data.user" id="sta-cnt">
          <span class="prf-txts" id="prf-username" v-if="data.user.login">@{{data.user.login}}</span>
          <span v-if="data.is_me"><i id="usr-state" style="color:green;" class="fas fa-circle"></i>
          <span>online</span></span>
          <span v-if="connected && !data.is_me"><i id="usr-state" style="color:green;" class="fas fa-circle"></i>
          <span>online</span></span>
          <span v-if="!connected && !data.is_me"><i id="usr-state" style="color:gray;" class="fas fa-circle"></i>
          <span>Active {{lastTime}}</span>
          <!-- <span v-else>Active {{moment(data.user.last_connection).fromNow()}}</span> -->
          </span>
        </div>
        <div v-if="data.user.tags" id="tags">
          <b-taglist>
            <b-tag size="is-medium" v-for="(item, i) in data.user.tags.split(',')" :key="i" id="single-tag">#{{item}}</b-tag>
          </b-taglist>
        </div>
        <div id="prf-bio">{{data.user.biography}}</div>
      </div>
    </div>
    <div v-else id="profile-card">
      <div id="nf-info">
        <img id="nf-img" src="@/assets/profile.png" />
        <div id="nf-msg">User Not Found!</div>
      </div>
    </div>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import socket from "../socket";
export default {
  async fetch()
  {
      const data = await this.$axios.$post('/account/getprofile', {username: this.$route.params.profile});
      this.data = data;
      await new Promise(r => {
        setTimeout(r, 100)
    });
      this.fetched = true;
      if(!data.block && data.user)
          this.rate= this.data.user.rating * 5 / 100
  
      if(!data.is_me && data.user && !data.block)
      {
        socket.emit("visit", {visited: this.data.user.login, visitor: this.data.loggedUser.login})
        this.lastTime = moment(this.data.user.last_connection).fromNow()
        const that = this
        let flag = 0

        setInterval(function(){
          that.updateTime()
        },60000);

        socket.emit("isConnected", this.$route.params.profile)

        socket.on(this.$route.params.profile, (message) => {
          that.connected = message
          if(!message && flag)
          {
            that.data.user.last_connection = moment()
            this.lastTime = moment(that.data.user.last_connection).fromNow()
          }
          flag = 1
        });

      }
  },
  data()
  {
      return{
          data:{
              user: {images: null},
              liked: null
          },
          rate: null,
          maxs: 5,
          sizes: '',
          icons: 'star',
          isSpaced: true,
          moment: moment,
          connected: false,
          lastTime: null,
          fetched: false
      }
  },
  beforeDestroy() {
    this.$snoast.close()
  },
  methods: {
    updateTime(){
      this.lastTime = moment(this.data.user.last_connection).fromNow()
    },
    async likeButton()
    {
      if(this.data.loggedUser.status > 2){
        if(!(this.data.liked)){
          const res = await this.$axios.$post("/matcha/like", {idLiked: this.data.user.id_user});
          this.data.liked =  this.data.liked ? false : true
          if(res.like === 'like')
            socket.emit("like", {liker: res.liker, liked: res.liked})
          if(res.like === 'match')
          {
            socket.emit("match1", {liker: res.liker, liked: res.liked})
            socket.emit("match2", {liked: res.liked, liker: res.liker}) 
          }
        }
        else{
          this.$buefy.dialog.confirm({
                title: 'Confirmation',
                message: `Are you Sure you want to Unlike <b>${this.data.user.login}</b>`,
                onConfirm:  async () => {
                    const result = await this.$axios.$post("/matcha/unlike", {idLiked: this.data.user.id_user})
                    if(result.unlike){
                      socket.emit("dislike", {unliker: result.unliker, unliked: result.unliked})
                    }
                      this.data.liked =  this.data.liked ? false : true
                  }
              })
        }
      }
      else this.$snoast.toast(this.$buefy, "You must add at least one Picture to complete this Action", 'is-danger')
    },
    async reportUseract(){
        const ret = await this.$axios.$post('/account/reportuser', {usr: this.data.user.id_user});
        if(ret.error)
              this.$snoast.toast(this.$buefy, "You Already Reported This Account", 'is-danger')
        else
            this.$snoast.toast(this.$buefy, "This Account Is Reported", 'is-success')
        return 1;
    },
    async blockUseract(){
        const ret = await this.$axios.$post('/account/blockuser', {usr: this.data.user.id_user});
        if(ret.error)
              this.$snoast.toast(this.$buefy, "Something went wrong Please try later!", 'is-danger')
        else
            this.data.block = true;
        return 1;
    },
    blockUser() {
        this.$buefy.dialog.confirm({
            title: `Block ${this.data.user.login}`,
            message: 'Are you sure you want to <b>Block</b> This User? This action cannot be undone.',
            confirmText: 'Block User',
            type: 'is-danger',
            hasIcon: true,
            onConfirm:  async () => this.blockUseract()
        })
    },
    reportUser() {
        this.$buefy.dialog.confirm({
            title: `Report ${this.data.user.login}`,
            message: 'Are you sure you want to <b>Report</b> This User as a <b>Fake Account</b>?',
            confirmText: 'Report User',
            type: 'is-danger',
            hasIcon: true,
            onConfirm: async () => this.reportUseract()
        })
    }
  }
}

</script>

<style src="@/style/profile.css" scoped>
</style>