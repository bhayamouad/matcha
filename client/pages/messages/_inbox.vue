<template>
  <div>
    messages inbox
    {{user}}
  </div>
</template>

<script>

export default {
    middleware: 'redirect',
    layout: 'home',
    async fetch(){
      const data = await this.$axios.$post("/matcha/getchat", {login: this.$route.params.inbox})
      console.log(data)
    },
    data(){
      return{
        user: this.$route.params.inbox
      }
    },
   components: {
    
  },
}
</script>

<style>

</style>