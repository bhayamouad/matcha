<template>
  <registerbox ></registerbox>
</template>

<script>
import registerbox from "~/components/RegisterBox";

export default {
  layout:'auth',
  name: "Register",
  head() {
    return {
      title: "Matcha - Register",
    };
  },
  components: {
    registerbox,
  },
};
</script>
<style>
</style>