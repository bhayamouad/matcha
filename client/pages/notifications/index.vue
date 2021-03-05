<template>
  <section ref="thelist">
    <div id="page-title">
      <h1>Notifications</h1>
    </div>
    <div id="page-cnt">
      <ul v-if="notifications" id="notifs">
        <li v-for="(item,index) in notifications" :key="index">
          <p v-if="item.type === 'like'">
            <nuxt-link :to="`/profile/${item.login_from}`">{{item.login_from}}</nuxt-link>
            Liked you {{time[index]}}.
          </p>
          <p v-if="item.type === 'dislike'">
            <nuxt-link :to="`/profile/${item.login_from}`">{{item.login_from}}</nuxt-link>
            Unliked you {{time[index]}}.
          </p>
          <p v-if="item.type === 'visit'">
            <nuxt-link :to="`/profile/${item.login_from}`">{{item.login_from}}</nuxt-link>
            Visited your Profile {{time[index]}}.
          </p>
          <p v-if="item.type === 'match1'">
            <nuxt-link :to="`/profile/${item.login_from}`">{{item.login_from}}</nuxt-link>
            Liked you Back You are Connected {{time[index]}}.
          </p>
          <p v-if="item.type === 'match2'">
            You and
            <nuxt-link :to="`/profile/${item.login_from}`">{{item.login_from}}</nuxt-link>
            are Connected {{time[index]}}.
          </p>
          <p v-if="item.type === 'message'">
            <nuxt-link :to="`/profile/${item.login_from}`">{{item.login_from}}</nuxt-link>
            send you a message {{time[index]}}.
          </p>
        </li>
        <div id="loader-cnt" v-if="showmore">
          <div class="loader"></div>
        </div>
      </ul>
      <div id="empty-msg" v-else>You don't have any Notification Right Now!</div>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import socket from "../../socket";

let hpr = 5, num, from, now

export default {
  middleware: "redirect",
  layout: "home",
  data() {
    return {
      notifications: [],
      time: [],
      moment: moment,
      more: false,
      showmore: false,
      notifCounter: null
    };
  },
  async mounted() {
    now = new Date(Date.now())
    const listElm = document.querySelector("#page-cnt");
    listElm.addEventListener("scroll", async e => {
      if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
        await new Promise(r => {
          setTimeout(r, 300);
        });
        if (this.more) {
          this.showmore = true;
          await new Promise(r => {
            setTimeout(r, 600);
          });
          await this.fetchNew();
          this.showmore = false;
        }
      }
    });
  },
  methods: {
    openLoading() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 10 * 1000);
    },
    async fetchNew() {
      from += num;
      num = hpr;
      const ret = await this.$axios.$post("/matcha/getNotifications", {
        from: from,
        num: num + 1,
        now
      });
      if (!ret.error) {
        if (ret.notifications[num]) {
          this.more = true;
          ret.notifications.pop();
        } else this.more = false;
        this.notifications = this.notifications.concat(ret.notifications);
        this.time = []
        this.notifications.forEach(element => {
            this.time.push(moment(element.created_at).fromNow())
        })
        await this.$axios.$put("/matcha/setNotifStatus", {
          from: from,
          num: num+1
        });
      }
    },
    updateTime(){
        this.time = []
        this.notifications.forEach(element => {
            this.time.push(moment(element.created_at).fromNow())
        });
    }
  },
  async fetch() {
    num = 14;
    from = 0;
    const ret = await this.$axios.$post("/matcha/getNotifications", {
      from: 0,
      num: num + 1,
      now: null
    });
    if (!ret.error) {
      if (ret.notifications.length) {
        if (ret.notifications[num]) {
          this.more = true;
          ret.notifications.pop();
        } else this.more = false;
        this.notifications = ret.notifications;
        await this.$axios.$put("/matcha/setNotifStatus", { from: 0, num: num+1 });
      } else this.notifications = null;
      this.notifCounter = ret.new;
    }
    const that = this
    this.notifications.forEach((element,index) => {
          that.time.push(moment(element.created_at).fromNow())
      })
      
    setInterval(function() {
        that.updateTime();
      }, 60000);

    socket.on("like" + ret.to, async (socketResult) => {
      if (socketResult.status){
        this.time.splice(0,0,moment(Date.now()).fromNow())
        this.notifications.splice(0,0, {type: 'like', created_at: Date.now(), login_from: socketResult.liker})
        await this.$axios.$put("/matcha/setNotifStatus", { from: 0, num: 1 });
      }
    });
    socket.on("dislike" + ret.to, async (socketResult) => {
      if (socketResult.status){
        this.time.splice(0,0,moment(Date.now()).fromNow())
        this.notifications.splice(0,0, {type: 'dislike', created_at: Date.now(),  login_from: socketResult.unliker})
        await this.$axios.$put("/matcha/setNotifStatus", { from: 0, num: 1 });
      }
    });

    socket.on("match1" + ret.to, async (socketResult) => {
      if (socketResult.status){
        this.time.splice(0,0,moment(Date.now()).fromNow())
        this.notifications.splice(0,0, {type: 'match1', created_at: Date.now(), login_from: socketResult.liker})
        await this.$axios.$put("/matcha/setNotifStatus", { from: 0, num: 1 });
      }
    });
    socket.on("match2" + ret.to, async (socketResult) => {
        this.time.splice(0,0,moment(Date.now()).fromNow())
        this.notifications.splice(0,0, {type: 'match2', created_at: Date.now(), login_from: socketResult.liked})
        await this.$axios.$put("/matcha/setNotifStatus", { from: 0, num: 1 });
    });
    socket.on("visit" + ret.to, async (socketResult) => {
      if (socketResult.status){
        this.time.splice(0,0,moment(Date.now()).fromNow())
        this.notifications.splice(0,0, {type: 'visit', created_at: Date.now(), login_from: socketResult.visitor})
        await this.$axios.$put("/matcha/setNotifStatus", { from: 0, num: 1 });
      }
    });
  }
};
</script>

<style>
#loader-cnt {
  width: 100%;
  height: 50px;
  /* background-color: red; */
}
#page-title {
  color: black;
  border-bottom: solid 3px #ebeef0;
  padding: 10px 30px;
  height: 50px;
}
#page-title h1 {
  font-size: 1.5rem;
  font-weight: 600;
}
#page-cnt {
  /* background-color: bisque; */
  overflow: auto;
  height: calc(100vh - 50px);
}
#page-cnt li {
  color: black;
  padding: 7px 30px;
  border-bottom: solid 1px #ebeef0;
}
#page-cnt ul {
  margin-bottom: 40vh;
}
#page-cnt li:hover {
  background-color: #f0f3f5;
}
#empty-msg {
  /* color: black; */
  width: 100%;
  text-align: center;
  padding-top: 20px;
  font-size: 1.3rem;
}
.loader {
  margin: auto;
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid gray;
  width: 40px;
  height: 40px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}
#loader-cnt {
  margin-top: 20px;
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>