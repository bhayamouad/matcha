<template>
  <div>
    <div id="inbox">
    <div id="chat-hdr">
      <nuxt-link id="chat-bck-btn" to="/messages"><i class="fas fa-arrow-left"></i></nuxt-link>
      <nuxt-link :to="'/profile/'+info.login">
      <div id="prfl-cnt"><img v-if="info.path" id="prfl-img" :src="$config.baseURL+'/'+info.path"> </div>
      </nuxt-link>
      <nuxt-link style="width: 100%" :to="'/profile/'+info.login">
      <div id="prfl-name">
        <span id="usr-fullname">{{info.fname}} {{info.lname}}</span><br>
        <span id="usr-login">@{{info.login}}</span><span ><i style="color:green;" class=" usr-state fas fa-circle"></i></span>
      </div></nuxt-link>
    </div>
      <div id="chat-cnt">
        <div v-for="(item,i) in messages" :key="i" >
          <span class="oth-msg" v-if="info.id_user == item.sender_id">{{item.message}}</span>
          <span class="self-msg" v-if="info.id_user != item.sender_id">{{item.message}}</span>
          <hr style="height:12px; visibility:hidden;" />
          </div>
        <div id="msg-inp-cnt"><b-field @keyup.native.enter="sendMsg" id="msg-input">
            <b-input  type="text"
                v-model="msg"
                placeholder="...">
            </b-input>
        </b-field></div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
    middleware: 'redirect',
    layout: 'home',
    async fetch(){
      const data = await this.$axios.$post("/matcha/getchat", {login: this.$route.params.inbox})
      this.info = data.info
      this.messages = data.messages

      console.log(data)
    },
    data(){
      return{
        info: {},
        messages: null,
        link: this.$config.clientURL,
        user: this.$route.params.inbox,
        msg: null
      }
    },
   methods: {
   sendMsg(){
     alert("trrrrr")
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
  padding: 7px 7px;
  width: 100%;
  height: calc(100vh - 70px);
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
width: 98%;
margin: auto;
}

.self-msg{
  background-color: #0099ff;
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