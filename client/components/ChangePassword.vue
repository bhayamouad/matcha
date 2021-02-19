<template>
  <div>
    <div id="login-form" @keyup.enter="change">
      <b-field
        v-if="(status && isPass)"
        label="Current Password"
        v-bind:type="{ 'is-danger': errors.opassword }"
        v-bind:message="errors.opassword"
      >
        <b-input
          type="password"
          v-model="passwords.opassword"
          placeholder="********"
        ></b-input>
      </b-field>
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
      <b-button @click="change" type="is-primary" :expanded="(status) ? false : true"
        >Change Password</b-button
      >
    </div>
    <div v-if="!status" id="buttom-links">
    Remembered your password?&nbsp;
    <NuxtLink to="/">Login</NuxtLink>
    </div>
  </div>
</template>

<script>

const validateOpassword = (opassword, status, isPass) => {
  if(status && isPass){
    if (!opassword)
      return { valid: false, error: "The Current Password is required" }
  }
  return { valid: true, error: null }
};

const validateNpassword = (npassword) => {
  if (!npassword )
    return { valid: false, error: "The New Password is required" };
  if (!npassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^A-Za-z0-9\s]).{8,}/))
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
  props:["isPass"],
  data() {
    return {
      status: this.$store.state.auth.loggedIn,
      passwords: {
        npassword: "",
        cpassword: "",
        opassword: "",
        token: this.$route.params.token
      },
      valid: true,
      errors: {}
    };
  },
  methods: {
    async change() {
      this.valid = true
      this.errors= {}
      const validOpassword = validateOpassword(this.passwords.opassword, this.status, this.isPass);
      this.errors.opassword = validOpassword.error;
      if (this.valid) this.valid = validOpassword.valid;
      console.log("old "+this.valid);
      
      const validNpassword = validateNpassword(this.passwords.npassword);
      this.errors.npassword = validNpassword.error;
      if (this.valid) this.valid = validNpassword.valid;

      const validCpassword = validateCpassword(
        this.passwords.cpassword,
        this.passwords.npassword
      );
      this.errors.cpassword = validCpassword.error;
      if (this.valid) this.valid = validCpassword.valid;
      console.log(this.valid);
      
      if (this.valid) {
        console.log("trr");
        
        let res = null
        if (this.passwords.token)
          res = await this.$axios.$post("/account/change-password", this.passwords);
        else
          res = await this.$axios.$put("/account/change-password", this.passwords);
        if (res.passError){
            this.valid = false;
            this.errors.opassword = "The Current password is incorrect"
        }
        else{
          if (!res.error)
          {
            this.$snoast.toast(this.$buefy, res.message, 'is-success')
            if (this.passwords.token)
              this.$router.push('/')
          }
          else{
            this.$snoast.toast(this.$buefy, res.message, 'is-danger')
            if (this.passwords.token)
              this.$router.push('/reset')
          }
        }
      }
      this.passwords = {
        npassword: this.npassword,
        cpassword: this.cpassword,
        opassword: this.opassword,
        token: this.$route.params.token
      }

    }
  }
};
</script>

<style>
</style>