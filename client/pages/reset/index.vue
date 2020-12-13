<template>
  <resetBox></resetBox>
</template>

<script>
import resetBox from "@/components/ResetPassword"

export default {
  layout:'auth',
  name: "ResetPassword",

  components: {
    resetBox,
  },
}
</script>
<style src="@/style/homepage.css">
</style>