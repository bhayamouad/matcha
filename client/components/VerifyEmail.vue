<template>
  <div class="the-box">
    <div id="blogo-container"><img id="blogo" src="~/assets/blogo.png" /></div>
    <div id="login-form">
      <b-field
        label="Email"
        v-bind:type="{ 'is-danger': errorEmail }"
        v-bind:message="errorEmail"
      >
        <b-input
          v-model="user.email"
          placeholder="e.g. tirachrach@gmail.com"
        ></b-input>
      </b-field>
      <b-button @click="sendEmail" type="is-primary" expanded
        >Send Email</b-button
      >
    </div>
    <NuxtLink to="/register">Register</NuxtLink>
    <NuxtLink to="/">Login</NuxtLink>
  </div>
</template>

<script>
const validateEmail = (email) => {
  if (!email) return { valid: false, error: "The Username is required" };
  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  )
    return { valid: false, error: "Please enter a valid email" };
  return { valid: true, error: null };
};
export default {
  data() {
    return {
      user: {
        email: "",
      },
      valid: true,
      errorEmail: "",
    };
  },
  methods: {
    async sendEmail() {
      this.errorEmail = "";
      this.valid = true;

      const validEmail = validateEmail(this.user.email);
      this.errorEmail = validEmail.error;
      if (this.valid) this.valid = validEmail.valid;

      if (this.valid) {
        const res = await this.$axios.$post("/account/verify", this.user);
        if (res.error) this.verifyError(res.message);
        if (res.success) this.verifySuccess(res.message);
      }
    },
    verifyError(msg) {
      this.$buefy.toast.open({
        duration: 5000,
        message: msg,
        type: "is-danger",
      });
    },
    verifySuccess(msg) {
      this.$buefy.toast.open({
        duration: 5000,
        message: msg,
        type: "is-success",
      });
    },
  },
};
</script>

<style>
</style>