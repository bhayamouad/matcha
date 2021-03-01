<template>
  <section ref="thelist">
    <div id="page-title">
      <h1>Messages</h1>
    </div>
    <div id="page-cnt">
      <ul v-if="matches">
        <li v-for="match in matches" :key="match.reciever">
          <div class="match-info">
            <span class="match-img-icon match-img">
              <img class="profile-img" :src="$config.baseURL+'/'+match.path" />
            </span>
            <span class="match-name">{{`${match.fname} ${match.lname}`}}</span>
            <span class="match-message">{{match.message}}</span>
            <span id="match-time">{{moment(match.sent_at).fromNow()}}</span>
          </div>
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
let newMoment = moment;
let hpr = 5,
  num,
  from,
  newMessages;
  newMoment.updateLocale('en', {
    relativeTime : {
        past: "%s",
        s: "%d s",
        ss: "%d s",
        m: "%d m",
        mm: "%d m",
        h: "%d h",
        hh: "%d h",
        d: "%d d",
        dd: "%d d",
        w: "%d w",
        ww: "%d w",
        M: "%d m",
        MM: "%d m",
        y: "%d y",
        yy: "%d y"
    }
});
export default {
  middleware: "redirect",
  layout: "home",
  data() {
    return {
      matches: [],
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
    const res = await this.$axios.$post("/matcha/getMessages", {
      from: 0,
      num: num + 1
    });

    this.matches = res.matches;
  }
};
</script>

<style lang="scss" scoped>
.match-info{
    display: grid;
    grid-template-areas:
    'img nme tme'
    'img msg tme';
    grid-column-gap: 9px;
    padding: 5px 8px;
    margin: auto 20px 40px 15px;
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
    width: 110px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.match-message{
    grid-area: msg;
    color: black;
    width: 110px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.match-time{
    grid-area: tme;
    margin: auto;
    font-size: 1.5rem;
}
</style>