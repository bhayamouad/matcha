<template>
  <div>
    <div id="login-form" @keyup.enter="login">
      <b-field
        label="Username or Email"
        v-bind:type="{'is-danger': errors.login}"
        v-bind:message="errors.login"
      >
        <b-input v-model="user.login" placeholder="e.g. tirachrach@gmail.com or tirach"></b-input>
      </b-field>
      <b-field
        label="Password"
        v-bind:type="{'is-danger': errors.password}"
        v-bind:message="errors.password"
      >
        <b-input type="password" v-model="user.password" placeholder="********"></b-input>
      </b-field>
      <div id="f-pswd">
        <NuxtLink to="/reset">Forgot password ?</NuxtLink>
      </div>
      <b-button @click="login" type="is-primary" expanded>Login</b-button>
        <authbtn></authbtn>
    </div>

    <div id="buttom-links">
      Dont have an account?&nbsp;
      <NuxtLink to="/register">Sign Up</NuxtLink>
    </div>
  </div>
</template>

<script>
import authbtn from '@/components/AuthBtns.vue';

const validateLogin = login => {
  if (!login) return { valid: false, error: "Please fill out this field." };
  return { valid: true, error: null };
};
const validatePassword = password => {
  if (!password) return { valid: false, error: "Please fill out this field." };
  return { valid: true, error: null };
};
export default {
  beforeDestroy() {
    this.$snoast.close()
  },
  data({$config}) {
    return {
      user: {
        login: "",
        password: ""
      },
      valid: true,
      errors: {}
    };
  },
  components: {authbtn},
  methods: {
    async login() {
      this.errors = {};
      this.valid = true;

      const validLogin = validateLogin(this.user.login);
      this.errors.login = validLogin.error;
      if (this.valid) this.valid = validLogin.valid;

      const validPassword = validatePassword(this.user.password);
      this.errors.password = validPassword.error;
      if (this.valid) this.valid = validPassword.valid;

      if (this.valid) {
        const res = await this.$axios.$post("/account/login", this.user);
        if(res.error){
          if (res.special) this.$snoast.snackbar(this.$buefy,res.error,'is-danger','Verify Now','/verify')
          if (!res.special) this.$snoast.toast(this.$buefy, res.error, 'is-danger')
        }
        else this.$router.go()
      }
    }
  }
};
</script>

<style>
</style>