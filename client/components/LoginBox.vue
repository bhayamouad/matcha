<template>
  <div class="the-box">
    <div id="blogo-container"><img id="blogo" src="~/assets/blogo.png" /></div>
    <div id="login-form">
      <b-field label="Username or Email">
        <b-input v-model="user.email" placeholder="eg. tirachrach"></b-input>
      </b-field>
      <b-field label="Password">
        <b-input
          type="password"
          v-model="user.password"
          placeholder="********"
        ></b-input>
      </b-field>
      <b-button @click="login" type="is-primary" expanded>Login</b-button>

    </div>
  </div>
</template>

<script>

export default {
    data(){
        return{
            user:{
                email: '',
                password: ''
                },
            }
    },
    methods:{
        async login(){
            const res = await this.$axios.$post('/account/login', this.user)
            if(res.message)
                this.loginError(res.message);
        },
        loginError(msg) {
            this.$buefy.toast.open({
                duration: 2000,
                message: msg,
                type: 'is-danger',
            })
            }
    }
};
</script>

<style>
</style>