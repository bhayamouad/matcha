<template>
  <section ref="thelist">
    <div id="page-title">
      <h1>Messages</h1>
    </div>
    <div id="page-cnt">
      <ul v-if="matches">
        <li v-for="(match,index) in matches" :key="match.reciever">
          <nuxt-link :to="`/messages/${match.login}`">
            <div class="match-info">
              <span class="match-img-icon match-img">
                <img class="profile-img" :src="$config.baseURL+'/'+match.path" />
              </span>
              <span class="match-name">{{`${match.fname} ${match.lname}`}}</span>
              <span :class="{'bold':match.status === 0}" class="match-message">{{(match.sender_id!==match.id_user && match.message)?"You: ":""}}{{(match.message)?match.message:`Start chatting with ${match.login}`}}</span>
              <span class="match-time">{{time[index]}}</span>
            </div>
          </nuxt-link>
        </li>
        <div id="loader-cnt" v-if="showmore">
          <div class="loader"></div>
        </div>
      </ul>
      <div id="empty-msg" v-else>You don't have any Match Right Now!</div>
    </div>
  </section>
</template>

<script>
import moment from "moment";

let hpr = 2, num, from, newMessages
// moment.updateLocale('en', {
//     relativeTime : {
//         past: "%s",
//         s: "%d s",
//         ss: "%d s",
//         m: "%d m",
//         mm: "%d m",
//         h: "%d h",
//         hh: "%d h",
//         d: "%d d",
//         dd: "%d d",
//         w: "%d w",
//         ww: "%d w",
//         M: "%d m",
//         MM: "%d m",
//         y: "%d y",
//         yy: "%d y"
//     }
// });
export default {
  middleware: "redirect",
  layout: "home",
  data() {
    return {
      matches: [],
      time: [],
      moment,
      more: null,
      showmore: false,
      messagesCounter: null
    };
  },
  async mounted() {
    await new Promise(r => {
      setTimeout(r, 400);
    });
    const listElm = document.querySelector("#page-cnt");
    newMessages = document.querySelector("#new-messages");
    newMessages.innerHTML =
      newMessages.innerHTML !== "" &&
      parseInt(newMessages.textContent) - this.messagesCounter > 0
        ? parseInt(newMessages.textContent) - this.messagesCounter
        : "";
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
  async fetch() {
    num = 7
    from = 0
    const res = await this.$axios.$post("/matcha/getMessages", {
      from,
      num: num + 1
    });
    if(!res.error)
    {
        if(res.matches.length)
        {
          if(res.matches[num])
          {
            this.more = true;
            res.matches.pop()
          }
          else
            this.more = false;
          this.matches = res.matches;
        }
        else
          this.matches = null;
        
        this.matches.forEach(element => {
          (element.sent_at) ? this.time.push(moment(element.sent_at).fromNow()) : this.time.push(moment(element.matched_at).fromNow())
        });
        const that = this
        setInterval(function() {
        that.updateTime();
      }, 60000);
    }
  },
  methods: {
    async fetchNew(){
      from += num;
      num = hpr;
      const ret = await this.$axios.$post('/matcha/getMessages', {from: from, num: num + 1});
      if(!ret.error)
      {
        console.log(ret.matches);
          if(ret.matches[num])
          {
            this.more = true;
            ret.matches.pop()
          }
          else
            this.more = false;
          this.matches = this.matches.concat(ret.matches);
      }
    }
  },
  updateTime(){
    this.time = []
        this.notifications.forEach(element => {
            (element.sent_at) ? this.time.push(moment(element.sent_at).fromNow()) : this.time.push(moment(element.matched_at).fromNow())
        });
  }
};
</script>

<style lang="scss" scoped>
.match-info{
    display: grid;
    grid-template-areas:
        "img nme tme"
        "img msg tme";
    grid-template-columns: 25% 50% 25%;
    padding: 5px 8px;
    margin: 20px 0px 20px 0px;
    border-radius: 50px;
}
.match-img{
    grid-area: img;
    width: 50px;
    height: 50px;
    overflow: hidden;
    border-radius: 50%;

}
.match-name{
    grid-area: nme;
    color: black;
    font-weight: 550;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.match-message{
    grid-area: msg;
    color: black;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.match-time{
    grid-area: tme;
}
#loader-cnt{
    width: 100%;
    height: 50px;
    margin-top: 20px;
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
.bold{
  font-weight: bold;
}
</style>