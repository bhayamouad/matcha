<template>
  <section ref="thelist">
      <div id="page-title">
          <h1>Notifications</h1>
      </div>
      <div id="page-cnt">
      <ul v-if="notifications">
        <li v-for="item in notifications" :key="item.id_notification">
            <p v-if="item.type === 'like'"> <a :href="$config.clientURL+'/profile/'+item.login">{{item.login}}</a> Liked you {{moment(item.created_at).fromNow()}}.</p>
            <p v-if="item.type === 'dislike'"> <a :href="$config.clientURL+'/profile/'+item.login">{{item.login}}</a> Unliked you {{moment(item.created_at).fromNow()}}.</p>
            <p v-if="item.type === 'visit'"> <a :href="$config.clientURL+'/profile/'+item.login">{{item.login}}</a> Visited your Profile {{moment(item.created_at).fromNow()}}.</p>
            <p v-if="item.type === 'match'"> <a :href="$config.clientURL+'/profile/'+item.login">{{item.login}}</a> Liked you Back You are Connected  {{moment(item.created_at).fromNow()}}.</p>
            <p v-if="item.type === 'message'"> <a :href="$config.clientURL+'/profile/'+item.login">{{item.login}}</a> send you a message  {{moment(item.created_at).fromNow()}}.</p>
        </li>
        <div id="loader-cnt" v-if="showmore"><div class="loader"></div></div>
      </ul>
        <div id="empty-msg" v-else>You don't have any Notification Right Now!</div>
      </div>
  </section>
</template>

<script>
import moment from 'moment'

let hpr, num, from

export default {
    middleware: 'redirect',
    layout: 'home',
    data(){
        return{
            notifications: [],
            moment: moment,
            more: false,
            showmore: false
        }
    },
    async mounted () {
    await new Promise(r => {
        setTimeout(r, 400)
    });
    const listElm = document.querySelector('#page-cnt');
    listElm.addEventListener('scroll', async e => {
        if(listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight)
        {
            await new Promise(r => {
                setTimeout(r, 300)
            });
            if(this.more)
                this.showmore = true;
            await new Promise(r => {
                setTimeout(r, 600)
            });
            await this.fetchNew();
            this.showmore = false;
        }
    });
  },
    methods: {
    openLoading() {
                this.isLoading = true
                setTimeout(() => {
                    this.isLoading = false
                }, 10 * 1000)
            },
    async fetchNew(){
        const ret = await this.$axios.$post('/matcha/getNotifications', {from: from, num: num + 1});
    from += num;
    if(ret.notifications)
        {
            if(ret.notifications[num])
            {
                this.more = true;
                ret.notifications.pop()
            }
            else
                this.more = false;
            this.notifications = this.notifications.concat(ret.notifications);
        }
        }
    },
    async fetch()
    {
        hpr = 5;
        num = 25;
        from = 0;
        const ret = await this.$axios.$post('/matcha/getNotifications', {from: 0, num: num + 1});
        if(ret.notifications)
        {
            if(ret.notifications.length)
            {
                if(ret.notifications[num])
                {
                    this.more = true;
                    ret.notifications.pop()
                }
                else
                    this.more = false;
                this.notifications = ret.notifications;
            }
            else
                this.notifications = null;
        }
        from = num;
        num = hpr;
    }
}
</script>

<style>
#loader-cnt{
    width: 100%;
    height: 50px;
    /* background-color: red; */
}
#page-title{
    color: black;
    border-bottom: solid 3px #ebeef0;
    padding: 10px 30px;
    height: 50px;
}
#page-title h1{
    font-size: 1.5rem;
    font-weight: 600;
}
#page-cnt{
    /* background-color: bisque; */
    overflow: auto;
    height: calc(100vh - 50px) ;
}
#page-cnt li{
    color: black;
    padding: 7px 30px;
    border-bottom: solid 1px #ebeef0;
}
#page-cnt ul{
    margin-bottom: 40vh;
}
#page-cnt li:hover{
    background-color: #f0f3f5;
}
#empty-msg{
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
#loader-cnt{
    margin-top: 20px;
}
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>