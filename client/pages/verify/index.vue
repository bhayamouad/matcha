<template>
  <verifyBox/>
</template>

<script>
import verifyBox from "@/components/VerifyEmail"

export default {
  layout:'auth',
  name: "VerifyEmail",

  components: {
    verifyBox,
  },
}
</script>
<style src="@/style/homepage.css">
</style>