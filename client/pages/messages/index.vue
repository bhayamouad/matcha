<template>
  <section ref="thelist">
    <div id="page-title">
      <h1>Messages</h1>
    </div>
    <div id="page-cnt">
      <ul v-if="matches">
        <li v-for="(match,index) in matches" :key="match.reciever">
          <nuxt-link :to="`/messages/${match.login}`">
            <div class="match-info" style="position: relative;">
              <span class="match-img-icon match-img">
                <img class="profile-img" :src="$config.baseURL+'/'+match.path" />
              </span>
              <i v-if="connected[index]" style="color:green;" class=" user-state fas fa-circle"></i>
              <i v-else style="color:gray;" class=" user-state fas fa-circle"></i>
              <span class="match-name">{{`${match.fname} ${match.lname}`}}</span>
              <span
                :class="{
                          'bold':(!match.message || match.status_first === 0 && (match.sender_id === match.id_user && match.message)) 
                                  || (match.status_second === 0 && (match.sender_id === match.id_user && match.message))
                        }"
                class="match-message"
              >
                {{(match.sender_id !== match.id_user && match.message)?"You: ":""}}{{(match.message)?match.message:`Say Hello!`}}
              </span>
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
import socket from "../../socket";

let hpr = 2,
  num,
  from,
  now,
  that,tmp

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
      connected: [],
      messagesCounter: null
    };
  },
  async mounted() {
    now = Date.now();
    await new Promise(r => {
      setTimeout(r, 400);
    });
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
  async fetch() {
    num = 7;
    from = 0;
    const res = await this.$axios.$post("/matcha/getMessages", {
      from,
      num: num + 1,
      now: null
    });
    if (!res.error) {
      if (res.matches.length) {
        if (res.matches[num]) {
          this.more = true;
          res.matches.pop();
        } else this.more = false;
        this.matches = res.matches;
        that = this;
        this.matches.forEach((element, index) => {
          this.time.push(moment(element.sent_at).fromNow());
          socket.emit("isConnected", element.login);
          socket.on(element.login, message => {
            tmp = that.connected.slice();
            tmp[index] = message;
            that.connected = tmp;
          });
        });
        socket.on("msg"+res.loggedUser, ( users ) => {
          if(that.matches.length)
            {
              that.matches.forEach((element,index) => {
                if(element.login === users.data.from){
                  let newMsg = element
                  that.matches.splice(index,1)
                  newMsg.message = users.data.msg
                  newMsg.status_first = 0
                  newMsg.status_first = 0
                  newMsg.sender_id = users.sender
                  newMsg.sent_at = Date.now()
                  that.matches.splice(0,0,newMsg)
                  return
                  }
              });
              that.updateTime()
              
            }
        })
      } else this.matches = null;
      setInterval(function() {
        that.updateTime();
      }, 60000);
    }
  },
  methods: {
    async fetchNew() {
      from += num;
      num = hpr;
      const ret = await this.$axios.$post("/matcha/getMessages", {
        from: from,
        num: num + 1,
        now
      });
      if (!ret.error) {
        if (ret.matches[num]) {
          this.more = true;
          ret.matches.pop();
        } else this.more = false;
        this.matches = this.matches.concat(ret.matches);
        that = this;
        this.matches.forEach((element, index) => {
          this.time.push(moment(element.sent_at).fromNow());
          socket.emit("isConnected", element.login);
          socket.on(element.login, message => {
            tmp = that.connected.slice();
            tmp[index] = message;
            that.connected = tmp;
          });
        });
      }
    },
    updateTime() {
      this.time = [];
      this.matches.forEach(element => {
        this.time.push(moment(element.sent_at).fromNow());
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#loader-cnt {
  width: 100%;
  height: 50px;
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
  width: 100%;
  text-align: center;
  padding-top: 20px;
  font-size: 1.3rem;
}
.profile-img{
  transform: translateY(-25%);
}
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
.match-img {
  grid-area: img;
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
}
.match-name {
  grid-area: nme;
  color: black;
  font-weight: 550;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.match-message {
  grid-area: msg;
  color: black;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.match-time {
  grid-area: tme;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #909090;
}
#loader-cnt {
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
.bold {
  font-weight: bold;
}
.user-state {
  color: green;
  font-size: 10px;
  border: solid 2px white;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  bottom: 2px;
  left: 40px;
}
@media (max-width: 800px) {
  #page-cnt li {
    color: black;
    padding: 0px;
    border-bottom: solid 1px #ebeef0;
  }
}
</style>