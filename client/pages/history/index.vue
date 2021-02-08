<template>
  <section>
      <div id="page-title">
          <h1>History</h1>
      </div>
      <div id="page-cnt">
    <div v-if="!history[0]">empty</div>
      <ul>
        <li v-for="item in history" :key="item.id_history">
        You Visited <a href="https://test.com">{{item.login}}</a> Profile {{moment(item.created_at).fromNow()}}.
        </li> 
      </ul>
      </div>
  </section>
</template>

<script>
import moment from 'moment'
export default {
    layout: 'home',
    data(){
        return{
            history: [],
            moment: moment
        }
    },
    async fetch()
    {
        //INSERT INTO histories (visitor_id, visited_id) VALUES (27,24)
        const ret = await this.$axios.$post('/matcha/gethistory');
        if(!ret.error)
        {
            this.history = ret.data;
        }
    }
}
</script>

<style>

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
    height: calc(100vh - 50px);
}

#page-cnt li{
    color: black;
    padding: 7px 30px;
    border-bottom: solid 1px #ebeef0;
}
#page-cnt li:hover{
    background-color: #ebeef0;
}

</style>