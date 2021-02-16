<template>
  <div>
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
  data({$config}) {
    return {
      link: $config.clientURL,
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
        if (res.error) this.$snoast.toast(this.$buefy, res.message, 'is-danger')
        else this.$snoast.toast(this.$buefy, res.message, 'is-success')
      }
    }
  }
};
</script>

<style>
</style>