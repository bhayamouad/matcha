<template>
  <section id="profile-sec">
    <div v-if="!data.block && data.user" id="profile-card">
    
        <div v-if="data.user.images" id="prf-images">
              <b-carousel :autoplay="false" :repeat="false" animated="fade">
        <b-carousel-item v-for="(image, i) in data.user.images.split(',')" :key="i">
            <section >
                <div class="hero-body has-text-centered">
               <img class="crsl-img" :src="$config.baseURL+'/'+image" />
                </div>
            </section>
        </b-carousel-item>
    </b-carousel>
        <div id="user-action">
        <i @click="blockUser" v-if="!data.is_me" class="fas fa-ban act-icons"></i>
        <i @click="reportUser" v-if="!data.is_me" class="fas fa-flag act-icons"></i>
        <nuxt-link v-if="data.is_me" to="/settings"><i  class="fas fa-user-edit act-icons"></i></nuxt-link>
        </div>
        </div>
        <div id="card-info">
        <div class="prf-txts" id="prf-name-cnt"><div id="prf-name">{{data.user.fname}} {{data.user.lname}}</div>
        <span v-if="data.user.birthdate" id="prf-age">, {{moment().diff(data.user.birthdate, 'years')}}</span>
        <i v-if="data.user.gender == 'F'" class="fas fa-venus usr-gender"></i>
        <i v-if="data.user.gender == 'M'" class="fas fa-mars usr-gender"></i>
        <i v-if="data.user.gender == 'O'" class="fas fa-neuter usr-gender"></i>
         <div v-if="data.user.rating" id="rating">
             <b-rate
            v-model="rate"
            icon-pack="fas"
            icon="star"
            :max="maxs"
            :size="sizes"
            :spaced="isSpaced"
            :disabled="true">
        </b-rate>
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
        <i id="usr-state" style="color:green;" class="fas fa-circle"></i>
        <span> online</span>
        </div>
        <div v-if="data.user.tags" id="tags">
            <b-taglist>
                <b-tag v-for="(item, i) in data.user.tags.split(',')" :key="i" id="single-tag">{{item}}</b-tag>
            </b-taglist>
        </div>
        <div  id="prf-bio">{{data.user.biography}}</div>
        </div>
    </div>
    <div v-else id="profile-card">
        <div id="nf-info">
        <img id="nf-img" src="@/assets/profile.png">
        <div id="nf-msg"> User Not Found!</div>
        </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment'
export default {
    layout: 'home',
    async fetch()
    {
        const data = await this.$axios.$post('/account/getprofile', {username: this.$route.params.profile});
        this.data = data;
        // console.log(data)
        if(!this.data.block && data.user)
            this.rate= this.data.user.rating * 5 / 100
        // console.log(data)
    },
    data()
    {
        return{
            data:{
                user: {images: null}
                },
            rate: null,
            maxs: 5,
            sizes: '',
            icons: 'star',
            isSpaced: true,
            moment: moment,
        }
    },
    methods: {
        blockUser() {
            this.$buefy.dialog.confirm({
                title: `Block ${this.data.user.login}`,
                message: 'Are you sure you want to <b>Block</b> This User? This action cannot be undone.',
                confirmText: 'Block User',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => alert("send request to Api")
            })
        },
        reportUser() {
            this.$buefy.dialog.confirm({
                title: `Report ${this.data.user.login}`,
                message: 'Are you sure you want to <b>Report</b> This User as a <b>Fake Account</b>?',
                confirmText: 'Report User',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => alert("send request to Api")
            })
        },
    },
}

</script>

<style src="@/style/profile.css" scoped> 
</style>