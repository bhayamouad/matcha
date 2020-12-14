<template>
  <div class="the-box">
    <div id="blogo-container"><img id="blogo" src="~/assets/blogo.png" /></div>
    <div id="login-form">
      <b-field label="" 
        v-bind:type="{'is-danger': errors.fname}"
        v-bind:message="errors.fname"
        >
        <b-input v-model="user.fname" placeholder="First Name"></b-input>
      </b-field>
      <b-field label="" 
        v-bind:type="{'is-danger': errors.lname}"
        v-bind:message="errors.lname"
      >
        <b-input v-model="user.lname" placeholder="Last Name"></b-input>
      </b-field>
      <b-field label="" 
        v-bind:type="{'is-danger': errors.email}"
        v-bind:message="errors.email"
        >
        <b-input v-model="user.email" placeholder="Email Address"></b-input>
      </b-field>
      <b-field label=""  
        v-bind:type="{'is-danger': errors.login}"
        v-bind:message="errors.login"
        >
        <b-input v-model="user.login" placeholder="Username"></b-input>
      </b-field>
      <b-field label="" 
        v-bind:type="{'is-danger': errors.password}"
        v-bind:message="errors.password"
        >
        <b-input
          type="password"
          v-model="user.password"
          placeholder="Password"
        ></b-input>
      </b-field>
      <b-field label="" 
        v-bind:type="{'is-danger': errors.cpassword}"
        v-bind:message="errors.cpassword"
        >
        <b-input
          type="password"
          v-model="user.cpassword"
          placeholder="Confirm Password"
        ></b-input>
      </b-field>
      <b-button @click="register" type="is-primary" expanded>Register</b-button>
    </div>
    <div id="re-link">Already have an account?
        <NuxtLink to="/">&nbsp;Login</NuxtLink>
    </div>
  </div>
</template>

<script>
  const validateFname = (fname) => {
    if (!fname) return { valid: false, error: "The First name is required" };
    if (fname.length < 3)
      return {
        valid: false,
        error: "The First name must have more than 2 characters",
      };
    return { valid: true, error: null };
  };
  const validateLname = (lname) => {
    if (!lname) return { valid: false, error: "The Last name is required" };
    if (lname.length < 3)
      return {
        valid: false,
        error: "The Last name must have more than 2 characters",
      };
    return { valid: true, error: null };
  };
  const validateEmail = (email) => {
    if (!email) return { valid: false, error: "The Email is required" };
    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      return { valid: false, error: "Please enter a valid email" };
    return { valid: true, error: null };
  };

  const validateLogin = (login) => {
    if (!login) return { valid: false, error: "The login is required" };
    if (login.length > 8)
      return { valid: false, error: "Login must have maximum 8 characteres" };
    return { valid: true, error: null };
  };
  const validatePassword = (password) => {
    if (!password) return { valid: false, error: "The Password is required" };
    if (
      !password.match(
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
  const validateCpassword = (cpassword, password) => {
    if (cpassword !== password)
      return { valid: false, error: "The the passwords do not match" };
    return { valid: true, error: null };
  };
export default {
  data () {
    return {
      user: {
        fname: '',
        lname: '',
        email: '',
        login: '',
        password: '',
        cpassword: ''
      },
      valid: null,
      errors: {}
    }
  },
  methods: {
    async register () {
      this.errors = {}
      this.valid = true
      
      const validFname = validateFname(this.user.fname)
      this.errors.fname = validFname.error
      if (this.valid) this.valid = validFname.valid
      
      const validLname = validateLname(this.user.lname)
      this.errors.lname = validLname.error
      if (this.valid) this.valid = validLname.valid

      const validEmail = validateEmail(this.user.email)
      this.errors.email = validEmail.error
      if (this.valid) this.valid = validEmail.valid

      const validLogin = validateLogin(this.user.login)
      this.errors.login = validLogin.error
      if (this.valid) this.valid = validLogin.valid

      const validPassword = validatePassword(this.user.password)
      this.errors.password = validPassword.error
      if (this.valid) this.valid = validPassword.valid
      else {
        this.user.password = ''
        this.user.cpassword = ''
      }

      const validCpassword = validateCpassword(this.user.cpassword,this.user.password)
      this.errors.cpassword = validCpassword.error
      if (this.valid) this.valid = validCpassword.valid
      else {
        this.user.password = ''
        this.user.cpassword = ''
      }

      if (this.valid) {
        const response = await this.$axios.$post('/account/register', {
          fname: this.user.fname,
          lname: this.user.lname,
          email: this.user.email,
          login: this.user.login,
          password: this.user.password,
          cpassword: this.user.cpassword
        })
  
        if(response.emailerr)
        {
            this.valid = false;
            this.errors.email = "This email already exists"
        }
        if(response.loginerr)
        {
            this.valid = false;
            this.errors.login = "This username already exists"
        }
        else {
          //redirect here to login page with a flash message (telling user to verify the email)
        }
        this.user = {
          fname: this.user.fname,
          lname: this.user.lname,
          email: this.user.email,
          login: this.user.login,
          password: this.user.password,
          cpassword: this.user.cpassword
          }
      }
    }
  }
}
</script>

<style>
</style>