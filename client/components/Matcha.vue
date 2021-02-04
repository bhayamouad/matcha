<template>
    <section>
    <div
      v-if="current"
      class="fixed fixed--center"
      style="z-index: 3"
      :class="{ 'transition': isVisible }">
      <Vue2InteractDraggable
        v-if="isVisible"
        :interact-out-of-sight-x-coordinate="600"
        :interact-max-rotation="15"
        :interact-x-threshold="100"
        :interact-y-threshold="100"
        :interact-event-bus-events="interactEventBus"
        interact-block-drag-down
        @draggedRight="emitAndNext('like')"
        @draggedLeft="emitAndNext('reject')"
        @draggedUp="emitAndNext('skip')"
        class="rounded-borders card card--one">
        <div style="height: 100%">
          <img
            :src="$config.baseURL+'/'+current.images.split(',')[0]"
            class="rounded-borders"/>
          <div class="text">
            <h2>{{current.login}}</h2>
          </div>
        </div>
      </Vue2InteractDraggable>
    </div>
    <div
      v-if="next"
      class="rounded-borders card card--two fixed fixed--center"
      style="z-index: 2">
      <div style="height: 100%">
        <img
          :src="$config.baseURL+'/'+next.images.split(',')[0]"
          class="rounded-borders"/>
        <div class="text">
            <h2>{{next.login}}</h2>
          </div>
      </div>
    </div>
    <div
      v-if="index + 2 < users.length"
      class="rounded-borders card card--three fixed fixed--center"
      style="z-index: 1">
      <div style="height: 100%">
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
  </section>
</template>

<script>
import { Vue2InteractDraggable, InteractEventBus } from 'vue2-interact'

export default {
    components: { Vue2InteractDraggable },
    data () {
        return {
            isVisible: true,
            index: 0,
            interactEventBus: {
                draggedRight: 'like',
                draggedLeft: 'reject',
                draggedUp: 'skip'
              },
            users: []
        }
    },
    async fetch (){
        
        const data = await this.$axios.$get('/account/getSuggestedUser')
        this.users = data.users
        
    },
    computed: {
        current() {
          const current = this.users[this.index]
            return current
        },
        next() {
          return this.users[this.index + 1]
        }
    },
    methods: {
        like() {
          InteractEventBus.$emit('like')
        },
        reject() {
          InteractEventBus.$emit('reject')
        },
        skip() {
          InteractEventBus.$emit('skip')
        },
        async emitAndNext(event) {
            this.$emit(event, this.index)
            if(event === 'like'){
              const response = await this.$axios.$post('/matcha/like', { idLiked:this.users[this.index].id_user })
              // if(!response.error)
              //   this.users.splice(this.index,1)
            }
            if(event === 'reject'){
              const response = await this.$axios.$post('/matcha/reject', { idDisliked: this.users[this.index].id_user })
            }
            setTimeout(() => this.isVisible = false, 200)
            setTimeout(() => {
                this.index++
                this.isVisible = true
            }, 200)
        }
    }
}
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
  font-family: 'Engagement', cursive;
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
  padding: .2rem;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 6px 6px -3px rgba(0,0,0,0.02), 0 10px 14px 1px rgba(0,0,0,0.02), 0 4px 18px 3px rgba(0,0,0,0.02);
  cursor: pointer;
  transition: all .3s ease;
  user-select: none;
  -webkit-tap-highlight-color:transparent;
  &:active {
    transform: translateY(4px);
  }
  i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    &::before {
      content: '';
    }
  }
  &--like {
    background-color: red;
    padding: .5rem;
    color: white;
    box-shadow: 0 10px 13px -6px rgba(0,0,0,.2), 0 20px 31px 3px rgba(0,0,0,.14), 0 8px 38px 7px rgba(0,0,0,.12);
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
  width: 500px;
  height: 700px;
  color: white;
  img {
    object-fit: cover;
    display: block;
    width: 100%;
    height: 100%;
  }
  &--one {
    box-shadow: 0 1px 3px rgba(0,0,0,.2), 0 1px 1px rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
  }
  &--two {
    transform: translate(-48%, -48%);
    box-shadow: 0 6px 6px -3px rgba(0,0,0,.2), 0 10px 14px 1px rgba(0,0,0,.14), 0 4px 18px 3px rgba(0,0,0,.12);
  }
  &--three {
    background: rgba(black, .8);
    transform: translate(-46%, -46%);
    box-shadow: 0 10px 13px -6px rgba(0,0,0,.2), 0 20px 31px 3px rgba(0,0,0,.14), 0 8px 38px 7px rgba(0,0,0,.12);
  }
  .text {
    position: absolute;
    bottom: 0;
    width: 100%;
    background:black;
    background:rgba(0,0,0,0.5);
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
@keyframes appear {
  from {
    transform: translate(-48%, -48%);
  }
  to {
    transform: translate(-50%, -50%);
  }
}
</style>