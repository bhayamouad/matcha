<template>
  <registerbox></registerbox>
</template>

<script>
import registerbox from "~/components/RegisterBox";

export default {
  layout:'auth',
  name: "Register",

  components: {
    registerbox,
  },
};
</script>
<style src="@/style/homepage.css">
</style>