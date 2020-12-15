<template>
  <changePassword></changePassword>
</template>

<script>
import changePassword from "@/components/ChangePassword"

export default {
  layout:'auth',
  name: "ChangePassword",
  components: {
    changePassword,
  }
  
}
</script>
<style src="@/style/homepage.css">
</style>