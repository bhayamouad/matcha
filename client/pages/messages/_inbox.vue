<template>
  <div>
    <div v-if="fetched" id="inbox">
    <div id="chat-hdr">
      <nuxt-link id="chat-bck-btn" to="/messages"><i class="fas fa-arrow-left"></i></nuxt-link>
      <nuxt-link :to="'/profile/'+info.login">
      <div id="prfl-cnt"><img v-if="info.path" id="prfl-img" :src="$config.baseURL+'/'+info.path"> </div>
      </nuxt-link>
      <nuxt-link style="width: 100%" :to="'/profile/'+info.login">
      <div id="prfl-name">
        <span id="usr-fullname">{{info.fname}} {{info.lname}}</span><br>
        <span id="usr-login">@{{info.login}}</span>
        <span >
          <i v-if="connected" style="color:green;" class=" usr-state fas fa-circle"></i>
          <i v-else style="color:gray;" class=" usr-state fas fa-circle"></i>
        </span>
      </div></nuxt-link>
    </div>
      <div v-if="messages" id="chat-cnt">
        <div  v-for="(item,i) in messages.slice().reverse()" :key="i" >
          <span class="oth-msg msg" v-if="info.id_user == item.sender_id">{{item.message}}</span>
          <span class="self-msg msg" v-if="info.id_user != item.sender_id">{{item.message}}</span>
          <!-- <hr style="height:0px; visibility:hidden;" /> -->
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
export default {
    // middleware: 'redirect',
    layout: 'home',
    async fetch(){
      const data = await this.$axios.$post("/matcha/getchat", {login: this.$route.params.inbox})
      if(data.error)
      {
        this.$router.push('/messages')
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
        socket.emit("isConnected", this.$route.params.inbox);
        socket.on(this.$route.params.inbox, message => {
          that.connected = message;
        });
        socket.on(this.$route.params.inbox+"=>"+this.info.me, message => {
          that.messages.push({sender_id:that.info.id_user ,message:message})
        });
      }
    },
    data(){
      return{
        info: {},
        messages: null,
        link: this.$config.clientURL,
        user: this.$route.params.inbox,
        msg: null,
        connected: false,
        fetched: false
      }
    },
   methods: {
     scrollToElement() {
      const elm = this.$el.getElementsByClassName('msg')[0];
      if (elm) 
        elm.scrollIntoView({behavior: 'smooth'});
  },
   async sendMsg(){
     if(this.msg)
     {
        const ret = await this.$axios.$post("/matcha/sendmsg",{to: this.info.id_user, msg: this.msg})
        if(!ret.error)
        {
          socket.emit("sendMsg", {from:this.info.me, to:this.$route.params.inbox, msg:this.msg});
          this.messages.push({sender_id:0,message:this.msg})
          this.msg = null
          //  await new Promise(r => {
          //     setTimeout(r, 10)
          //   });
          // this.scrollToElement()
        }
        else
          alert("something went wong!")
     }
   } 
  },
}
</script>

<style>
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
.usr-state{
  font-size: 10px;
    margin-left: 8px;

}
#chat-cnt{
  display: flex;
  flex-direction: column-reverse;
  padding: 7px 10px;
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y:  scroll;
  overflow-x: hidden;
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