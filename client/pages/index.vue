<template>
  <loginbox></loginbox>
</template>

<script>
import loginbox from "~/components/LoginBox";

export default {
  layout: 'auth',
  name: "HomePage",

  components: {
    loginbox,
  },
  head() {
    return {
      title: "Matcha - Welcome",
    };
  },
};
</script>
<style src="@/style/homepage.css">
</style>
