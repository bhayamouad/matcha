<template>
  <section ref="thelist">
    <div id="page-title">
      <h1>History</h1>
    </div>
    <div id="page-cnt">
      <ul v-if="history">
        <li v-for="(item, index) in history" :key="item.id_history">
          You visited
          <nuxt-link :to="`/profile/${item.login}`">{{ item.login }}</nuxt-link>
          profile. <span class="match-time">{{time[index]}}</span>
        </li>
        <div id="loader-cnt" v-if="showmore"><div class="loader"></div></div>
      </ul>
      <div id="empty-msg" v-else>No profile visited yet!</div>
    </div>
  </section>
</template>

<script>
import moment from "moment";

let hpr, num, from;
export default {
  middleware: "redirect",
  layout: "home",
  data() {
    return {
      history: [],
      time: [],
      moment: moment,
      more: false,
      showmore: false,
    };
  },
  async mounted() {
    // await new Promise(r => {
    //     setTimeout(r, 400)
    // });
    const listElm = document.querySelector("#page-cnt");
    listElm.addEventListener("scroll", async (e) => {
      if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
        await new Promise((r) => {
          setTimeout(r, 300);
        });
        if (this.more) this.showmore = true;
        await new Promise((r) => {
          setTimeout(r, 600);
        });
        await this.fetchNew();
        this.showmore = false;
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
      const ret = await this.$axios.$post("/matcha/gethistory", {
        from: from,
        num: num + 1,
      });
      from += num;
      if (!ret.error) {
        if (ret.data[num]) {
          this.more = true;
          ret.data.pop();
        } else this.more = false;
        this.history = this.history.concat(ret.data);
        this.time = []
        this.history.forEach((element) => {
          this.time.push(moment(element.created_at).fromNow());
        });
      }
    },
    updateTime(){
        this.time = []
        this.history.forEach(element => {
            this.time.push(moment(element.created_at).fromNow())
        })
    }
  },
  async fetch() {
    hpr = 5;
    num = 15;
    from = 0;
    const ret = await this.$axios.$post("/matcha/gethistory", {
      from: 0,
      num: num + 1,
    });
    if (!ret.error) {
      if (ret.data.length) {
        if (ret.data[num]) {
          this.more = true;
          ret.data.pop();
        } else this.more = false;
        this.history = ret.data;
        this.history.forEach((element) => {
          this.time.push(moment(element.created_at).fromNow());
        });
        const that = this;
        setInterval(function () {
          that.updateTime();
        }, 60000);
      } else this.history = null;
    }
    from = num;
    num = hpr;
  },
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
.match-time{
  margin-left: 5px;
  color: #909090;
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