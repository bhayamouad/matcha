<template>
  <section>
    <div
      v-if="current"
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
        <b-carousel  :autoplay="false" :indicator="(current.images.split(',').length > 1) ? true: false" indicator-position="is-top" indicator-style="is-lines" :repeat="false" animated="fade">
          <b-carousel-item style="transition: none !important;" v-for="(image, i) in current.images.split(',')" :key="i">
            <div class="card">
              <img :src="$config.baseURL+'/'+current.images.split(',')[i]" />
            </div>
          </b-carousel-item>
        </b-carousel>
        <div id="info-content">
          <p class="is-6">
            <span class="overflow">
              {{ current.fname.replace(/^\w/, (c) => c.toUpperCase())}} {{current.lname.replace(/^\w/, (c) => c.toUpperCase())}}
            </span>, {{current.age}}</p>
          <p class="overflow is-7"><i class="fas fa-home"></i> Lives in {{current.city}}</p>
          <p class="is-7"><i style="margin-left: 3px;" class="fas fa-map-marker-alt"></i> {{Math.ceil(current.distance)}} Km away</p>
        </div>
      </Vue2InteractDraggable>
    </div>
    <div v-if="next" class="rounded-borders card fixed fixed--center" style="z-index: 2">
      <b-carousel  :autoplay="false" :indicator="(next.images.split(',').length > 1) ? true: false" indicator-position="is-top" indicator-style="is-lines" :repeat="false" animated="fade">
          <b-carousel-item style="transition: none !important;" v-for="(image, i) in next.images.split(',')" :key="i">
            <div class="card">
              <img :src="$config.baseURL+'/'+next.images.split(',')[i]" />
            </div>
          </b-carousel-item>
        </b-carousel>
        <div id="info-content">
          <p class="is-6">
            <span class="overflow">
              {{ next.fname.replace(/^\w/, (c) => c.toUpperCase())}} {{next.lname.replace(/^\w/, (c) => c.toUpperCase())}}
            </span>, {{next.age}}</p>
          <p class="overflow is-7"><i class="fas fa-home"></i> Lives in {{next.city}}</p>
          <p class="is-7"> <i class="fas fa-map-marker-alt"></i> {{Math.ceil(next.distance)}} Km away</p>
        </div>
    </div>
    <div
      v-if="index + 2 < users.length"
      class="rounded-borders card fixed fixed--center"
      style="z-index: 1"
    >
      <div style="height: 100%"></div>
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
  </section>
</template>

<script>
import { Vue2InteractDraggable, InteractEventBus } from "vue2-interact";

export default {
  props: ["status"],
  components: { Vue2InteractDraggable },
  data() {
    return {
      isVisible: true,
      index: 0,
      interactEventBus: {
        draggedRight: "like",
        draggedLeft: "reject",
        draggedUp: "skip"
      },
      users: []
    };
  },
  async fetch() {
    const data = await this.$axios.$get("/account/getSuggestedUser");
    this.users = data.users;
    console.log(this.users);
  },
  computed: {
    current() {
      return this.users[this.index];
    },
    next() {
      return this.users[this.index + 1];
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
        setTimeout(() => (this.isVisible = false), 200);
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
          "You must add at least one image to your profile",
          "is-danger"
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background: #eceff1;
  width: 100%;
  height: 100vh;
}
.header {
  color: white;
  font-style: italic;
  font-family: "Engagement", cursive;
  background: #950740;
  display: flex;
  justify-content: space-between;
  span {
    display: block;
    font-size: 4rem;
    padding-top: 2rem;
    text-shadow: 1px 1px 1px red;
  }
  i {
    padding: 24px;
  }
}
.foot {
  width: 50%;
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

.transition {
  animation: appear 200ms ease-in;
}

#info-content{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: rgb(0,0,0,0.5);
}
.overflow{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@keyframes appear {
  from {
    transform: translate(-48%, -48%);
  }
  to {
    transform: translate(-50%, -50%);
  }
}
</style>