<template>
  <div>
    <h1>Register</h1>
    <div>
        <label>First Name:</label>
        <input type="text" v-model="user.fname" />
        <div v-if="errors.fname">{{ errors.fname }}</div>
    </div>
    <div>
        <label>Last Name:</label>
        <input type="text" v-model="user.lname" />
        <div v-if="errors.lname">{{ errors.lname }}</div>
    </div>
    <div>
        <label>Email:</label>
        <input type="email" v-model="user.email" />
        <div v-if="errors.email">{{ errors.email }}</div>
    </div>
    <div>
        <label>Login:</label>
        <input type="text" v-model="user.login"/>
        <div v-if="errors.login">{{ errors.login }}</div>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" v-model="user.password" />
        <div v-if="errors.password">{{ errors.password }}</div>
    </div>
    <div>
        <label>Confirm Password:</label>
        <input type="password" v-model="user.cpassword" />
        <div v-if="errors.cpassword">{{ errors.cpassword }}</div>
    </div>
    <button @click="register">Register</button>
  </div>
</template>
<script>
import Authentication from '@/services/Authentication'
const validateFname = fname => {
  if (!fname) return { valid: false, error: 'The First name is required' }
  if (fname.length < 3) return { valid: false, error: 'The First name must have more than 2 characters' }
  return { valid: true, error: null }
}
const validateLname = lname => {
  if (!lname) return { valid: false, error: 'The Last name is required' }
  if (lname.length < 3) return { valid: false, error: 'The Last name must have more than 2 characters' }
  return { valid: true, error: null }
}
const validateEmail = email => {
  if (!email) return { valid: false, error: 'The Email is required' }
  if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) return { valid: false, error: 'Please enter a valid email' }
  return { valid: true, error: null }
}

const validateLogin = login => {
  if (!login) return { valid: false, error: 'The login is required' }
  if (login.length > 8) return { valid: false, error: 'Login must have maximum 8 characteres' }
  return { valid: true, error: null }
}
const validatePassword = password => {
  if (!password) return { valid: false, error: 'The Password is required' }
  if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[^A-Za-z0-9\s]).{8,}/)) return { valid: false, error: 'Enter a combination of at least 8 numbers, uppercase, lowercase and special charracters (such as @,&...).' }
  return { valid: true, error: null }
}
const validateCpassword = (cpassword,password) => {
  if (cpassword !== password) return { valid:false, error: 'The the passwords do not match' }
  return { valid: true, error: null }
}

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
        const response = await Authentication.register({
          fname: this.user.fname,
          lname: this.user.lname,
          email: this.user.email,
          login: this.user.login,
          password: this.user.password,
          cpassword: this.user.cpassword
        })
        console.log(response)
        this.user = {
          fname: '',
          lname: '',
          email: '',
          login: '',
          password: '',
          cpassword: ''
          }
      }
    }
  }
}
</script>
<style>
</style>
