<template>
  <div class="the-box">
    <div id="blogo-container"><img id="blogo" src="~/assets/blogo.png" /></div>
    <div id="login-form">
      <b-field label="Username or Email"
      v-bind:type="{'is-danger': errors.email}"
      v-bind:message="errors.email"
      >
        <b-input v-model="user.email" placeholder="e.g. tirachrach@gmail.com"></b-input>
      </b-field>
      <b-field label="Password"
      v-bind:type="{'is-danger': errors.password}"
      v-bind:message="errors.password"
      >
        <b-input
          type="password"
          v-model="user.password"
          placeholder="********"
        ></b-input>
      </b-field>
        <div id="f-pswd"><NuxtLink to="/reset">Forgot password ? </NuxtLink></div>
      <b-button @click="login" type="is-primary" expanded>Login</b-button>

    </div>
    <div id="re-link">Dont have an account?
      <NuxtLink to="/register">&nbsp;Sign Up </NuxtLink>
    </div>
  </div>
</template>

<script>
const validateEmail = (email) => {
  if(!email) return {valid: false, error: 'Please fill out this field.'}
  return { valid: true, error: null };
}
const validatePassword = (pwd) => {
  if(!pwd) return {valid: false, error: 'Please fill out this field.'}
  return { valid: true, error: null };
}

export default {
    data(){
        return{
            user:{
                email: '',
                password: ''
                },
            valid: null,
            errors: {}
            }
    },
    methods:{
        async login(){
          this.valid = true
          const validemail = validateEmail(this.user.email)
          this.errors.email = validemail.error
          if (this.valid) this.valid = validemail.valid

          const validpwd = validatePassword(this.user.password)
          this.errors.password = validpwd.error
          if (this.valid) this.valid = validpwd.valid

          if(this.valid)
          {
            console.log('hello');
            const res = await this.$axios.$post('/account/login', this.user)
            if(res.message)
                this.loginError(res.message);
          }
          this.user = {
            email: this.user.email,
            password: this.user.password
          }
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