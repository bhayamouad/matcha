<template>
  <div>hello from home {{theret}}  </div>
</template>

<script>
// import Cookies from 'js-cookie'
// import { mapMutations } from 'vuex'

export default {
  middleware: 'authorization',
  name: "HomePage",
  head() {
    return {
      title: "Matcha",
    };
    
  },
};
</script>
<style src="@/style/homepage.css">
</style>
