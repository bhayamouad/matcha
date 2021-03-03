<template>
  <section id="section">
    <div class="header">
      <div style="display: flex;justify-content: space-around;">
      <i @click="openMap" class="fas fa-map-marked-alt clk"></i>
      <i @click="opens = true" class="clk fas fa-sort-amount-up"></i>
      <i @click="openf = true" class="clk fas fa-filter"></i>
      <i @click="open = true" class="clk fas fa-search"></i>
      </div>
    <b-sidebar
      type="is-light"
      :fullheight="true"
      :fullwidth="false"
      :overlay="false"
      :right="true"
      v-model="openf"
      
      >
          <div style="padding:40px">
            <h1 id="filter-ttl">Filter Results</h1>
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
                :min="5"
                :max="50"
                :custom-formatter=" val => (val===200)?'+'+val.toString()+' Km':val.toString()+' Km'"
                :step="1"
                rounded
              ></b-slider>
            </b-field >
            <div class="sinfo"><span class="rinfo" >{{distance>=200?'+':' '}}{{distance}} km</span></div>
            <b-field class="filters" label="Common Tags">
              <b-numberinput v-model="commonTags" :max="5" :min="0" @input="filters"></b-numberinput>
            </b-field>
          <b-button id="filter-btn" @click="filters" type="is-primary" expanded><b>Apply Filters</b></b-button>
          </div>

    </b-sidebar>
    <b-sidebar
      type="is-light"
      :fullheight="true"
      :fullwidth="false"
      :overlay="false"
      :right="true"
      v-model="open"
      
      >
      <search @clicked="moreUsers"/>
    </b-sidebar>
    <b-sidebar
      type="is-light"
      :fullheight="true"
      :fullwidth="false"
      :overlay="false"
      :right="true"
      v-model="opens"
      
      >
        <div id="sort-check">
            <div id="filter-ttl">Sort By</div>
            <b-switch class="filter-switch" v-model="sortGroup" native-value="1" @input="sort">
                Age
            </b-switch>
            <b-switch class="filter-switch" v-model="sortGroup" native-value="2" @input="sort">
                Location
            </b-switch>
            <b-switch class="filter-switch" v-model="sortGroup" native-value="3" @input="sort">
                Fame Rating
            </b-switch>
            <b-switch class="filter-switch" v-model="sortGroup" native-value="4" @input="sort">
                Common Tags
            </b-switch>
          </div>
        </b-sidebar>
    </div>



    <div class="fixed fixed--center" v-if="loading"><div class="loaders"></div></div>
    <div
      v-if="current && !loading"
      class="fixed fixed--center"
      style="z-index: 3"
      :class="{ 'transition': isVisible }"
    >
      <Vue2InteractDraggable
        v-if="isVisible"
        :interact-out-of-sight-x-coordinate="600"
        :interact-max-rotation="15"
        :interact-x-threshold="100"
        :interact-y-threshold="100"
        :interact-event-bus-events="interactEventBus"
        interact-block-drag-down
        @draggedRight="emitAndNext('like', status)"
        @draggedLeft="emitAndNext('reject', status)"
        @draggedUp="emitAndNext('skip', status)"
        class="rounded-borders card card--one"
      >
        <b-carousel
          :autoplay="false"
          :indicator="(current.images.split(',').length > 1) ? true: false"
          indicator-position="is-top"
          indicator-style="is-lines"
          :repeat="false"
          animated="fade"
        >
          <b-carousel-item
            style="transition: none !important;"
            v-for="(image, i) in current.images.split(',')"
            :key="i"
          >
            <div class="card">
              <img :src="$config.baseURL+'/'+image" />
            </div>
          </b-carousel-item>
        </b-carousel>
        <nuxt-link class="info-content" :to="`/profile/${current.login}`">
          <div>
            <p class="is-6">
              <span
                class="overflow"
              >{{ current.fname}} {{current.lname}}</span>
              , {{current.age}}
            </p>
            <p class="overflow is-7">
              <i class="fas fa-home"></i>
              Lives in {{current.city}}
            </p>
            <p class="is-7">
              <i style="margin-left: 3px;" class="fas fa-map-marker-alt"></i>
              {{Math.ceil(current.distance)}} Km away
            </p>
          </div>
        </nuxt-link>
      </Vue2InteractDraggable>
    </div>
    <div id="empty-msg" v-if="!loading && !current">There is no Profile Available right now Please Search More</div>
    <div v-if="next && !loading" class="rounded-borders card fixed fixed--center" style="z-index: 2">
      <b-carousel
        :has-drag="false"
        :autoplay="false"
        :indicator="(next.images.split(',').length > 1) ? true: false"
        indicator-position="is-top"
        indicator-style="is-lines"
        :repeat="false"
        animated="fade"
      >
        <b-carousel-item
          style="transition: none !important;"
          v-for="(image, i) in next.images.split(',')"
          :key="i"
        >
          <div class="card">
            <img :src="$config.baseURL+'/'+image" />
          </div>
        </b-carousel-item>
      </b-carousel>
      <div class="info-content">
        <p class="is-6">
          <span
            class="overflow"
          >{{ next.fname}} {{next.lname}}</span>
          , {{next.age}}
        </p>
        <p class="overflow is-7">
          <i class="fas fa-home"></i>
          Lives in {{next.city}}
        </p>
        <p class="is-7">
          <i class="fas fa-map-marker-alt"></i>
          {{Math.ceil(next.distance)}} Km away
        </p>
      </div>
    </div>
    <div class="foot">
      <div class="btn btn--decline" @click="reject">
        <i class="material-icons">close</i>
      </div>
      <div class="btn btn--skip" @click="skip">
        <i class="material-icons">call_missed</i>
      </div>
      <div class="btn btn--like" @click="like">
        <i class="material-icons">favorite</i>
      </div>
    </div>
    <b-modal v-model="isMapModalActive" :can-cancel="['x', 'escape']">
      <position-maps ref="posMap" :users="users" :distance="distance" />
    </b-modal>
  </section>
</template>

<script>
import { Vue2InteractDraggable, InteractEventBus } from "vue2-interact";
import PositionMaps from "@/components/PositionMaps.vue";
import Search from "@/components/SearchMore.vue"
let data = [];
export default {
  props: ["status"],
  components: {
    Vue2InteractDraggable,
    PositionMaps,
    Search
  },
  data() {
    return {
      isVisible: true,
      index: 0,
      interactEventBus: {
        draggedRight: "like",
        draggedLeft: "reject",
        draggedUp: "skip"
      },
      users: [],
      isMapModalActive: false,
      ageGap: [18, 50],
      rateGap: [0, 5],
      distance: 50,
      commonTags: 0,
      sortGroup:[],
      open: false,
      openf: false,
      opens: false,
      loading: true
    };
  },
  async fetch() {
    await new Promise(r => {
              setTimeout(r, 1000)
            });
    data = await this.$axios.$get("/matcha/getSuggestedUser");
    this.users = Array.from(data.users);
    if(this.users)
      this.loading = false
    
  },
  computed: {
    current() {
      return this.users[this.index];
    },
    next() {
      return this.users[this.index + 1];
    },
    commonTag() {
      if (this.commonTags === -1) return null;
      return this.commonTags;
    }
  },
  methods: {
    like() {
      InteractEventBus.$emit("like");
    },
    reject() {
      InteractEventBus.$emit("reject");
    },
    skip() {
      InteractEventBus.$emit("skip");
    },
    async emitAndNext(event, status) {
      if (status === 3) {
        this.$emit(event, this.index);
        if (event === "like") {
          await this.$axios.$post("/matcha/like", {
            idLiked: this.users[this.index].id_user
          });

        }
        if (event === "reject") {
          await this.$axios.$post("/matcha/reject", {
            idDisliked: this.users[this.index].id_user
          });
        }
        setTimeout(() => {
          this.isVisible = false        
        }, 200);
        setTimeout(() => {
          this.index++;
          this.isVisible = true;
        }, 200);
      } else {
        this.$emit("skip");
        setTimeout(() => (this.isVisible = false), 200);
        setTimeout(() => {
          this.index;
          this.isVisible = true;
        }, 200);
        this.$snoast.toast(
          this.$buefy,
          "You must add at least one Picture to complete this Action",
          "is-danger"
        );
      }
    },
    openMap() {
      this.isMapModalActive = true;
    },
    async filters() {
      this.loading = true
      this.openf = false
      await new Promise(r => {
              setTimeout(r, 500)
          });
      this.loading = false
      this.users = data.users.filter((user) => {
        if ( (user.age >= this.ageGap[0] && user.age <= this.ageGap[1]) 
          && ((user.rating * 5) / 100 >= this.rateGap[0] && (user.rating * 5) / 100 <= this.rateGap[1]) 
          && (user.distance <= this.distance)
          && (user.common_tags >= this.commonTags))
          return true;
        return false;
      });
    },
    async sort(){
      this.loading = true
      await new Promise(r => {
              setTimeout(r, 100)
          });
      this.opens = false;
      await new Promise(r => {
              setTimeout(r, 500)
          });
      this.loading = false
      console.log(this.sortGroup.length);
      if(this.sortGroup.length){
        this.sortGroup.forEach((by) => {
          switch(by) {
            case "1":
              this.users.sort( (user1, user2) => user1.age - user2.age)
              break;
            case "2":
              this.users.sort( (user1, user2) => user1.distance - user2.distance )
              break;
            case "3":
              this.users.sort( (user1, user2) => user2.rating - user1.rating)
              break;
            case "4":
              this.users.sort( (user1, user2) => user2.common_tags - user1.common_tags)
              break;
          }  
        })
      }
      else
        this.users = Array.from(data.users)
    },
    async moreUsers(newUsers){
      this.open = false
      this.loading = true
      await new Promise(r => {
                setTimeout(r, 2000)
            });
      this.loading = false
      
      this.index = 0
      this.users = newUsers
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background: #eceff1;
  width: 100%;
  height: 100vh;
  // position: relative;
}
section {
  position: relative;
  height: 100vh;
}
.header {
  padding: 20px 30px;
  color: white;
  background: rgb(195, 7, 63);
  // height: 150px;
}
.clk{
  font-size: 25px;
}
.clk:hover{
  cursor: pointer;
}
.foot {
  width: 100%;
  display: flex;
  position: absolute;
  bottom: 0;
  display: flex;
  padding-bottom: 30px;
  justify-content: space-around;
}
.btn {
  position: relative;
  width: 50px;
  height: 50px;
  padding: 0.2rem;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 6px 6px -3px rgba(0, 0, 0, 0.02),
    0 10px 14px 1px rgba(0, 0, 0, 0.02), 0 4px 18px 3px rgba(0, 0, 0, 0.02);
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  &:active {
    transform: translateY(4px);
  }
  i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    &::before {
      content: "";
    }
  }
  &--like {
    background-color: red;
    padding: 0.5rem;
    color: white;
    box-shadow: 0 10px 13px -6px rgba(0, 0, 0, 0.2),
      0 20px 31px 3px rgba(0, 0, 0, 0.14), 0 8px 38px 7px rgba(0, 0, 0, 0.12);
    i {
      font-size: 32px;
    }
  }
  &--decline {
    color: red;
  }
  &--skip {
    color: green;
  }
}
.flex {
  display: flex;
  &--center {
    align-items: center;
    justify-content: center;
  }
}
.fixed {
  position: fixed;
  &--center {
    left: 60%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.rounded-borders {
  border-radius: 12px;
}
.card {
  width: 280px;
  height: 420px;
  color: white;
  img {
    object-fit: cover;
    display: block;
    width: 100%;
    height: 100%;
  }
  &--one {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14),
      0 2px 1px -1px rgba(0, 0, 0, 0.12);
  }
  &--two {
    transform: translate(-48%, -48%);
    box-shadow: 0 6px 6px -3px rgba(0, 0, 0, 0.2),
      0 10px 14px 1px rgba(0, 0, 0, 0.14), 0 4px 18px 3px rgba(0, 0, 0, 0.12);
  }
  &--three {
    background: rgba(black, 0.8);
    transform: translate(-46%, -46%);
    box-shadow: 0 10px 13px -6px rgba(0, 0, 0, 0.2),
      0 20px 31px 3px rgba(0, 0, 0, 0.14), 0 8px 38px 7px rgba(0, 0, 0, 0.12);
  }
  .text {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: black;
    background: rgba(0, 0, 0, 0.5);
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
    text-indent: 20px;
    span {
      font-weight: normal;
    }
  }
}

.loaders {
    margin: auto;
    border: 4px solid rgb(195, 7, 63, 0.2);
    border-radius: 50%;
    border-top: 4px solid #950740;
    width: 40px;
    height: 40px;
    -webkit-animation: spin 0.5s linear infinite; /* Safari */
    animation: spin 0.5s linear infinite;
}

#empty-msg{
    /* color: black; */
    width: 100%;
    text-align: center;
    padding-top: 20px;
    font-size: 1.3rem;
}

.transition {
  animation: appear 200ms ease-in;
}

.info-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: rgb(0, 0, 0, 0.5);
  color: white;
}
.overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.btn--like{
  background-color:rgb(195, 7, 63);
}
.filters {
  margin-bottom: 50px;
}
#sort-check{
  text-align: center;
  color: black;
  padding: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  font-size: 1rem;
  font-weight: 500;
}
#filter-ttl, #filter-ttl{
  color: black;
  font-weight: 700;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 30px;
}
.filter-switch{
  margin-top: 30px;
  font-size: 1.2rem;
}

#filter-btn{
  margin-top: 30px;
}

@keyframes appear {
  from {
    transform: translate(-48%, -48%);
  }
  to {
    transform: translate(-50%, -50%);
  }
}
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
@media (max-width: 800px)
{
  #sort-check{
  font-size: .8rem;
  font-weight: 500;
}
}
</style>