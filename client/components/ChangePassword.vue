<template>
  <div class="the-box">
    <div id="blogo-container"><img id="blogo" src="~/assets/blogo.png" /></div>
    <div id="login-form" @keyup.enter="change">
      <b-field
        label="New Password"
        v-bind:type="{ 'is-danger': errors.npassword }"
        v-bind:message="errors.npassword"
      >
        <b-input
          type="password"
          v-model="passwords.npassword"
          placeholder="********"
        ></b-input>
      </b-field>
      <b-field
        label="Confirm Password"
        v-bind:type="{ 'is-danger': errors.cpassword }"
        v-bind:message="errors.cpassword"
      >
        <b-input
          type="password"
          v-model="passwords.cpassword"
          placeholder="********"
        ></b-input>
      </b-field>
      <b-button @click="change" type="is-primary" expanded
        >Change Password</b-button
      >
    </div>
    <NuxtLink to="/register">Register</NuxtLink>
    <NuxtLink to="/">login</NuxtLink>
  </div>
</template>

<script>
const validateNpassword = (npassword) => {
  if (!npassword)
    return { valid: false, error: "The New Password is required" };
  if (
    !npassword.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^A-Za-z0-9\s]).{8,}/
    )
  )
    return {
      valid: false,
      error:
        "Enter a combination of at least 8 numbers, uppercase, lowercase and special charracters (such as @,&...).",
    };
  return { valid: true, error: null };
};
const validateCpassword = (cpassword, npassword) => {
  if (cpassword !== npassword)
    return { valid: false, error: "The the passwords do not match" };
  return { valid: true, error: null };
};
export default {
  props: ["token"],
  data() {
    return {
      passwords: {
        npassword: "",
        cpassword: "",
        token: this.$route.params.token,
      },
      valid: true,
      errors: {},
    };
  },
  methods: {
    async change() {
      this.errors = {};
      this.valid = true;

      const validNpassword = validateNpassword(this.passwords.npassword);
      this.errors.npassword = validNpassword.error;
      if (this.valid) this.valid = validNpassword.valid;

      const validCpassword = validateCpassword(
        this.passwords.cpassword,
        this.passwords.npassword
      );
      this.errors.cpassword = validCpassword.error;
      if (this.valid) this.valid = validCpassword.valid;

      if (this.valid) {
        const res = await this.$axios.$post(
          "/account/changePassword",
          this.passwords
        );
        if (res.error) this.changeError(res.message);
        if (res.success) this.changeSuccess(res.message);
      }
    },
    changeError(msg) {
      this.$buefy.toast.open({
        duration: 2000,
        message: msg,
        type: "is-danger",
      });
    },
    changeSuccess(msg) {
      this.$buefy.toast.open({
        duration: 2000,
        message: msg,
        type: "is-success",
      });
    }
  },
};
</script>

<style>
</style>