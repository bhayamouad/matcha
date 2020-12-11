<template>
  <h1>{{res}}</h1>
</template>

<script>
export default {
    data(){
        return{
            res: this.fetchSomething()
        }
    },
     methods:{
      async fetchSomething() {
    const ip = await this.$axios.$post('/account/login', {email:'', password:''})
    this.res = ip
  }
     }
}
</script>

<style>

</style>