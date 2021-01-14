<template>
  <section> 
    <steps v-if="status"/>
    <Matcha v-if="!status"/>
  </section>
</template>

<script>
import Steps from '@/components/StepsBox.vue';
import Matcha from '@/components/Matcha.vue';
export default {
  layout: 'home',
  components: {
    Steps,
    Matcha
  },
  name: "HomePage",
  head() {
    return {
      title: "Matcha"
    }
  },
  data () {
    return {
      status: -1
    }
  },
  async fetch () {
    const res = await this.$axios.$get('/account/getStatus')
    if(res.status == 1)
      this.status = 1;
    else
      this.status = 0;
  },
  methods: {
  },
}
</script>
<style src="@/style/homepage.css">
</style>