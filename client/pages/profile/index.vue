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
        <nuxt-link v-if="data.is_me" to="/settings"><i  class="fas fa-user-edit act-icons"></i></nuxt-link>
        </div>
        </div>
        <div id="card-info">
        <div class="prf-txts" id="prf-name-cnt"><div id="prf-name">{{data.user.fname}} {{data.user.lname}}</div>
        <span v-if="data.user.birthdate" id="prf-age">, {{moment().diff(data.user.birthdate, 'years')}}</span>
        <i v-if="data.user.gender == 'F'" class="fas fa-venus usr-gender"></i>
        <i v-if="data.user.gender == 'M'" class="fas fa-mars usr-gender"></i>
        <i v-if="data.user.gender == 'O'" class="fas fa-neuter usr-gender"></i>
         <div v-if="data.user" id="rating">
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
        <div v-if="data.user.interest" id="interest">
        <span>Looking For</span>
        <i v-if="data.user.interest == 'F'" class="fas fa-venus usr-int"></i>
        <i v-if="data.user.interest == 'M'" class="fas fa-mars usr-int"></i>
        <i v-if="data.user.interest == 'B'" class="fas fa-venus-mars usr-int"></i>
        </div>
        <div v-if="data.user" id="sta-cnt">
        <span class="prf-txts" id="prf-username" v-if="data.user.login">@{{data.user.login}}</span>
        <i id="usr-state" style="color:green;" class="fas fa-circle"></i><span> online</span>
        </div>
        <div v-if="data.user.tags" id="tags">
            <b-taglist>
                <b-tag v-for="(item, i) in data.user.tags.split(',')" :key="i" id="single-tag">#{{item}}</b-tag>
            </b-taglist>
        </div>
        <div  id="prf-bio">{{data.user.biography}}</div>
        </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment'
export default {
    middleware: 'redirect',
    layout: 'home',
    async fetch()
    {
        const data = await this.$axios.$post('/account/getprofile', {username: ''});
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
    }
}

</script>

<style src="@/style/profile.css" scoped> 
</style>