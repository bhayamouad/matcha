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
    if(res.error)
      redirect('/reset')
  }

}
</script>
<style src="@/style/homepage.css">
</style>