<template>
  <section> 
    <steps v-if="true"/>
    <!-- <Matcha/> -->
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
<style>

</style>