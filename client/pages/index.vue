<template>
  <div>
    <loginbox></loginbox>
  </div>

</template>

<script>
import loginbox from "~/components/LoginBox";

export default {
  layout: 'auth',
  name: "HomePage",
  components: {loginbox}
};
</script>
<style>
</style>
