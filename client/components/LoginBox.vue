<template>
  <div class="the-box">
    <div id="blogo-container">
      <img id="blogo" src="~/assets/blogo.png" />
    </div>
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
        <div id="f-pswd"><NuxtLink to="/reset">Forgot password ? </NuxtLink></div>
      <b-button @click="login" type="is-primary" expanded>Login</b-button>
    </div>
    <div id="buttom-links">Dont have an account?
      <NuxtLink to="/register">&nbsp;Sign Up </NuxtLink>
    </div>

  </div>
</template>

<script>

const validateLogin = login => {
  if (!login) return { valid: false, error: 'Please fill out this field.' };
  return { valid: true, error: null };
};
const validatePassword = password => {
  if (!password) return { valid: false, error: 'Please fill out this field.' };
  return { valid: true, error: null };
};
export default {
  data() {
    return {
      user: {
        login: "",
        password: ""
      },
      valid: true,
      errors: {}
    };
  },
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
        if (res.error) this.loginError(res.message);
        if (res.success) {
          this.$router.push('/register')
          this.loginSuccess(res.message);}
      }
    },
    loginError(msg) {
      this.$buefy.toast.open({
        duration: 2000,
        message: msg,
        type: "is-danger"
      });
    },
    loginSuccess(msg) {
      this.$buefy.toast.open({
        duration: 2000,
        message: msg,
        type: "is-success"
      });
    }
  }
};
</script>

<style>
</style>