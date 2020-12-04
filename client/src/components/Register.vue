<template>
  <div>
    <h1>Register</h1>
    <input
      type="text"
      name="username"
      placeholder="username"
      v-model="username"
    />
    <input type="email" name="email" placeholder="email" v-model="email" />
    <button @click="register">Register</button>
  </div>
</template>
<script>
import Authentication from '@/services/Authentication'
export default {
  data () {
    return {
      username: '',
      email: ''
    }
  },
  methods: {
    register () {
      const response = Authentication.register({
        username: this.username,
        email: this.email
      })
      console.log(response.data)
    }
  }
}
</script>
<style>
</style>
