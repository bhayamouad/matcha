<template>
  <div>
    <h1>Hello There!</h1>
    <authbtn></authbtn>
    <!-- <a :href=params.googleLink>Login with google</a>
    <br>
    <a :href=params.googleLink>Login with google</a> -->
  </div>
</template>

<script>
import authbtn from '@/components/AuthBtns.vue';
const queryString = require('query-string');

const gParams = queryString.stringify({
  client_id: `662979618051-fnrho7ms8fjcaaa8vkako0mpe5c51va5.apps.googleusercontent.com`,
  redirect_uri: 'https://localhost:8080/test',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' '),
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
});
const urlParams = queryString.parse(window.location.search);
if (urlParams.error) {
  alert(`An error occurred: ${urlParams.error}`);
} else if(urlParams.code) {
  alert(`The code is: ${urlParams.code}`);
}
export default {
  components: {authbtn},
  // beforeCreate(){
  //   this.$snoast.toast(this.$buefy, 'test', 'is-danger')
  // },
  data(){
    return {
      params:{
        googleLink: `https://accounts.google.com/o/oauth2/v2/auth?${gParams}`
      }
    }
  }
}
</script>

<style>
body{
text-align: center;
}
h1{
    font-size: 100px;
}
</style>