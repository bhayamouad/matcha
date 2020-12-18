<template>
  <div class="the-box">
    <div id="blogo-container"><img id="blogo" src="~/assets/blogo.png" /></div>
    <div id="login-form" @keyup.enter="sendEmail">
      <b-field
        label="Username or Email"
        v-bind:type="{ 'is-danger': errorLogin }"
        v-bind:message="errorLogin"
      >
        <b-input
          v-model="username.login"
          placeholder="e.g. tirachrach@gmail.com or tirach"
        ></b-input>
      </b-field>
      <b-button @click="sendEmail" type="is-primary" expanded
        >Send Email</b-button
      >
    </div>
    <div id="buttom-links">
    Remembered your password?&nbsp;
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
      username: {
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

      const validLogin = validateLogin(this.username.login);
      this.errorLogin = validLogin.error;
      if (this.valid) this.valid = validLogin.valid;

      if (this.valid) {
        const res = await this.$axios.$post("/account/reset", this.username);
        if (res.error) this.resetError(res.message);
        if (res.success) this.resetSuccess(res.message);
      }
    },
    resetError(msg) {
      this.$buefy.toast.open({
        duration: 5000,
        message: msg,
        type: "is-danger",
      });
    },
    resetSuccess(msg){
       this.$buefy.toast.open({
        duration: 5000,
        message: msg,
        type: "is-success",
      });
    }
  },
};
</script>

<style>
</style>