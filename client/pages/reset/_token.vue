<template>
<div>
  <changePassword></changePassword>
</div>
</template>

<script>
import changePassword from "@/components/ChangePassword"
export default {
  layout:'auth',
  name: "ChangePassword",
  components: {
    changePassword,
  },
  
  
  async asyncData({$axios, params, redirect}){
    const res = await $axios.$get(`/account/reset/${params.token}`)
    if(!res.success)
      redirect('/reset')
  }
  // methods:{
  //   async checkToken(){
  //     const res = await this.$axios.$get(`/account/reset/${this.$route.params.token}`);
  //     console.log(res) //to remove
  //     if(!res.success)
  //       this.$router.push('/reset')
  //   }
  // }
  
}
</script>
<style src="@/style/homepage.css">
</style>