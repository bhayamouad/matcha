<template>
  <div>
    <div v-if="fetched" id="inbox">
    <div id="chat-hdr">
      <nuxt-link id="chat-bck-btn" to="/messages"><i class="fas fa-arrow-left"></i></nuxt-link>
      <nuxt-link :to="'/profile/'+info.login" class="profile">
      <div id="prfl-cnt">
        <img v-if="info.path" id="prfl-img" :src="$config.baseURL+'/'+info.path">
        <i v-if="connected" style="color:green;" class=" usr-state fas fa-circle"></i>
        <i v-else style="color:gray;" class=" usr-state fas fa-circle"></i>
      </div>
      </nuxt-link>
      <nuxt-link style="width: 100%" :to="'/profile/'+info.login">
      <div id="prfl-name">
        <span id="usr-fullname">{{info.fname}} {{info.lname}}</span><br>
        <span id="usr-login">@{{info.login}}</span>
      </div></nuxt-link>
    </div>
      <div v-if="messages" ref="chat" id="chat-cnt">
        <div  v-for="(item,i) in messages" :key="i" >
          <span class="oth-msg msg" v-if="info.id_user == item.sender_id">{{item.message}}</span>
          <span class="self-msg msg" v-if="info.id_user != item.sender_id">{{item.message}}</span>
          </div>
          <div id="loader-cnt" >
            <div v-if="loader" class="loader"></div>
            <div v-else style="height:40px;width:40px;"></div>
            </div>
      </div>
        <div id="msg-inp-cnt"><b-field @keyup.native.enter="sendMsg" id="msg-input">
            <b-input  type="text"
                v-model="msg"
                placeholder="">
            </b-input>
        </b-field></div>
    </div>
  </div>
</template>

<script>
import socket from "@/socket";
let to
export default {
    middleware: 'redirect',
    layout: 'home',
    async fetch(){
      to = this.$route.params.inbox
      const data = await this.$axios.$post("/matcha/getchat", {login: to, from:this.from, num:this.num+1, now: this.now})
      if(data.error)
      {
        this.$router.push('/messages')
        return ;
      }
      else
      {
        await new Promise(r => {
          setTimeout(r, 100);
        });
        this.fetched = true;
        this.info = data.info
        this.messages = data.messages
        const that = this
        socket.emit("isConnected", to);
        socket.on(to, message => {
          that.connected = message;
        });
        socket.on(to+"=>"+this.info.me, message => {
          that.messages.unshift({sender_id:that.info.id_user ,message:message})
          that.scrollToElement();
        });
      }
      if(!data.messages[this.num])
        this.flag = false
      else
        data.messages.pop();
      this.from += this.num;
      this.num = 5; // here number to bring after fisrt fetsh
    },
    async created(){
      const trr = await this.$axios.$put("/matcha/setMessageStatus", {status: 1, profile: this.user})
      if(!trr.read)
        this.$store.commit('notifications/clearMessages')
    },
    async mounted(){
      await new Promise(r => {
        setTimeout(r, 1000)
    });
       const listElm = document.querySelector("#chat-cnt");
    if(listElm)
      listElm.addEventListener("scroll", async (e) => {
        if(listElm.scrollTop == 0 &&  this.flag && this.sflag) {

          this.sflag = false
          this.loader = true;
          await new Promise(r => {
            setTimeout(r, 1000)
          });
          const messages = await this.fetchNew()
          this.sflag = true
          this.loader = false;
          if(messages)
            this.messages = this.messages.concat(messages)
        }
      });
    },
    beforeDestroy(){
      socket.emit("inactiveInbox", {from: this.info.me, to});
    },
    data(){
      return{
        info: {},
        messages: null,
        link: this.$config.clientURL,
        user: this.$route.params.inbox,
        msg: null,
        connected: false,
        active: null,
        fetched: false,
        loader: false,
        from: 0,
        num: 40,
        flag: true,
        sflag: true,
        now: new Date(Date.now())
      }
    },
    beforeDestroy() {
    this.$snoast.close()
  },
   methods: {
     async fetchNew(){
       const newData = await this.$axios.$post("/matcha/getchat", {login: to, from:this.from, num:this.num + 1, now: this.now})
      if(!newData.messages[this.num])
        this.flag = false
      else
        newData.messages.pop();
        this.from += this.num;
        console.log(newData.messages)
        if(!newData.messages.length)
          this.flag = false;
        return (newData.messages)
     },
     async scrollToElement() {
       await new Promise(r => {
              setTimeout(r, 10)
            });
      const elm = this.$el.getElementsByClassName('msg')[0];
      if (elm) 
        elm.scrollIntoView({behavior: 'smooth'});
  },
   async sendMsg(){
     if(this.msg)
      this.msg = this.msg.trim()
     if(this.msg)
     {
       if(this.msg.length > 200)
          this.$snoast.toast(this.$buefy, 'Your message is too long!', 'is-danger')
        else
        {
          const ret = await this.$axios.$post("/matcha/sendmsg",{to: this.info.id_user, msg: this.msg})
          if(!ret.error)
          {
            socket.emit("sendMsg", {from:this.info.me, to:this.$route.params.inbox, msg:this.msg});
            this.messages.unshift({sender_id:0,message:this.msg})
            this.msg = null
            this.scrollToElement()
          }
          else
            this.$snoast.toast(this.$buefy, 'Something went wrong, Please try later!', 'is-danger')
        }
     }
   } 
  },
}
</script>

<style scoped>
#loader-cnt {
  /* background-color: red; */
  width: 100%;
  height: 200px;
  padding: 30px;
}
.loader {
  margin: auto;
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid gray;
  width: 40px;
  height: 40px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

#chat-hdr{
  width: 100%;
  height: 70px;
  border-bottom: solid 3px #ebeef0;
  display: flex;
  flex-direction: row;
  align-items: center;
}
#chat-bck-btn{
  font-size: 32px;
  margin-left: 20px;
  color: #950740;
}
#chat-bck-btn:hover{
  color: #950740;
}
#usr-fullname{
  font-weight: 500;
}
#inbox{
  position: relative;
  height: 100vh;
}
#prfl-cnt{
  width: 50px;
  height: 50px;
  margin-left: 40px;
  border-radius: 50%;
  overflow: hidden;
}
#prfl-img{
  transform: translateY(-25%);
}
#prfl-name{
  max-width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 20px;
  color: black;
}
#usr-login{
  max-width: 50%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.profile{
  position: relative;
}
.usr-state{
  font-size: 10px;
  margin-left: 8px;
  position: absolute;
  bottom: 0;
  right:4px;
  border: solid 2px white;
  border-radius: 50%;
  background-color: white;

}
#chat-cnt{
  display: flex;
  flex-direction: column-reverse;
  padding: 7px 10px;
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y:  scroll;
  /* overflow-x: hidden; */
}
#msg-inp-cnt{
  position: absolute;
  bottom: 0px;
  width: 100%;
  transform: translateX(-50%);
  padding-bottom: 10px;
  left: 50%;
}
#msg-input{
width: 95%;
margin: auto;
}
.msg{
  margin-bottom: 5px;
  max-width: 90%;
  word-wrap: break-word;
}
.self-msg{
  background-color: #C3073F;
    float: right;
    padding: 5px 15px;
    border-radius: 20px;
    color: white;
    
}
.oth-msg{
  background-color: #e4e6eb;
  float: left;
  padding: 5px 15px;
  border-radius: 20px;
  color: black;
}
</style>