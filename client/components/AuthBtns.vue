<template>
  <div id="auth-cmp">
      <a :href=fbLink><div id="fb-btn" > <i class="fab fa-facebook-f"></i> &nbsp;Facebook</div></a>
      <a :href=gglLink><div id="ggl-btn"><i class="fab fa-google"></i> &nbsp;Google</div></a>
  </div>
</template>

<script>
const queryString = require('query-string');

export default {
    data(){
        return{
            fbLink: `https://www.facebook.com/v4.0/dialog/oauth?${this.fbParams()}`,
            gglLink:  `https://accounts.google.com/o/oauth2/v2/auth?${this.gglParams()}`
        }
    },
    methods:{
        gglParams(){
            return queryString.stringify({
                client_id: `662979618051-fnrho7ms8fjcaaa8vkako0mpe5c51va5.apps.googleusercontent.com`,
                redirect_uri: 'https://localhost:8080/oauth/google',
                scope: [
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile',
                ].join(' '),
                response_type: 'code',
                access_type: 'offline',
                prompt: 'consent',
            });
        },
        fbParams(){
            return queryString.stringify({
                client_id: '425669022113452',
                redirect_uri: 'https://localhost:8080/oauth/facebook',
                scope: ['email'],
                response_type: 'code',
                auth_type: 'rerequest',
            });
        }
    }
}


</script>

<style>
#auth-cmp{
    /* background-color: greenyellow; */
    display: grid;
    grid-template-areas:
    'fbb gglb';
    grid-gap: 10px;
    padding: 10px 0px;
    width: 100%;
    max-width: 400px;
    margin: auto;
    padding-top: 15px;
}
#fb-btn,#ggl-btn{
    font-size: 1rem;
    padding: 7px 0px;
    border-radius: 3px;
    color: white;
    width: 100%;
    text-align: center;
}
#ggl-btn{
    background-color: #DB4437;
    grid-area: fbb;
}
#fb-btn{
    background-color: #4267B2;
    grid-area: gglb;
}
</style>