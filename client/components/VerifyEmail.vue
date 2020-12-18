<template>
  <div class="the-box">
    <div id="blogo-container"><img id="blogo" src="~/assets/blogo.png" /></div>
    <div id="login-form" @keyup.enter="sendEmail">
      <b-field
        label="Email or Username"
        v-bind:type="{ 'is-danger': errorLogin }"
        v-bind:message="errorLogin"
      >
        <b-input
          v-model="user.login"
          placeholder="e.g. tirachrach@gmail.com"
        ></b-input>
      </b-field>
      <b-button @click="sendEmail" type="is-primary" expanded
        >Send Email</b-button
      >
    </div>
    <div id="buttom-links">
    Already verified?&nbsp;
    <NuxtLink to="/">Login</NuxtLink>
    </div>
  </div>
</template>

<script>
const validateLogin = (login) => {
  if (!login) return { valid: false, error: "The Username is required" };
  return { valid: true, error: null };
};
export default {
  data() {
    return {
      user: {
        login: "",
      },
      valid: true,
      errorLogin: "",
    };
  },
  methods: {
    async sendEmail() {
      this.errorLogin = "";
      this.valid = true;

      const validLogin = validateLogin(this.user.login);
      this.errorLogin = validLogin.error;
      if (this.valid) this.valid = validLogin.valid;

      if (this.valid) {
        const res = await this.$axios.$post("/account/verify", this.user);
        if(res.redirect) this.$router.push('/')
        if (res.error) this.verifyError(res.message);
        else this.verifySuccess(res.message);
      }
    },
    verifyError(msg) {
      this.$buefy.toast.open({
        duration: 7000,
        message: msg,
        type: "is-danger",
      });
    },
    verifySuccess(msg) {
      this.$buefy.toast.open({
        duration: 7000,
        message: msg,
        type: "is-success",
      });
    },
  },
};
</script>

<style>
</style>