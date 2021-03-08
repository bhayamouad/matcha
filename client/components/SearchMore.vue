<template>
  <div style="padding:40px">
    <h1 id="srch-ttl">Custom Search</h1>
    <b-field class="filters" label="Age">
      <b-slider
        v-model="ageGap"
        type="is-primary"
        :min="18"
        :max="50"
        :custom-formatter=" val => (val===50)?'+'+val.toString():val.toString()"
        :step="1"
        rounded
      />
    </b-field>
    <div class="sinfo"><span class="rinfo" >{{ageGap[0]}}</span>  <span class="linfo">{{ageGap[1]>=50?'+':''}}{{ageGap[1]}}</span></div>
    <b-field class="filters" label="Rating">
      <b-slider
        v-model="rateGap"
        type="is-primary"
        :min="0"
        :max="5"
        :step="1"
        rounded
        
      />
    </b-field>
      <div class="sinfo"><span class="rinfo" >{{rateGap[0]}} <i class="sstar fas fa-star"></i></span>
      <span class="linfo" >{{rateGap[1]}} <i class="sstar fas fa-star"></i></span>
      </div>
    <b-field class="filters" label="Distance">
      <b-slider
        type="is-primary"
        v-model="distance"
        :min="10"
        :max="200"
        :custom-formatter=" val => (val===200)?'+'+val.toString()+' Km':val.toString()+' Km'"
        :step="1"
        rounded
      ></b-slider>
    </b-field>
      <div class="sinfo"><span class="rinfo" >{{distance>=200?'+':' '}}{{distance}} km</span></div>
    <b-field class="filters">
      <b-field label="Tags">
        <b-taginput
          v-model="tags"
          ellipsis
          icon="label"
          placeholder="Add Tags"
          aria-close-label="Delete this tag"
        ></b-taginput>
      </b-field>
    </b-field>
    <b-field>
    <b-button id="srch-btn" @click="search" type="is-primary" expanded><b>Search</b></b-button>
    </b-field>
  </div>
</template>

<script>
export default {
  data() {
    return {
        ageGap: [18, 50],
        rateGap: [0, 5],
        distance: 200,
        tags:[]
    };
  },
  methods: {
    async search(){
      const data = await this.$axios.$post("/matcha/search",{ageGap:this.ageGap,rateGap: this.rateGap, distance: this.distance, tags:this.tags})
      if(!data.error)
        this.$emit('clicked', data.users)
      else this.$snoast.toast(this.$buefy, res.error, 'is-danger')
    }
  },
};
</script>

<style lang="scss" scoped>
.filters{
  margin-bottom: 0px;
}
.linfo{
  float: right;
  margin-bottom: 20px;
  font-weight: 700;

}
.rinfo{
  font-weight: 700;
}
.sinfo{
  margin-top: -10px;
  margin-bottom: 30px;
}
.sstar{
  color: #ffd83d;
}
#srch-ttl{
  color: black;
  font-weight: 700;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 30px;
}
#srch-btn{
  margin-top: 30px;
}
</style>