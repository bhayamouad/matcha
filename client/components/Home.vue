<template>
  <section> 
    <steps v-if="status == 1"/>
    <Matcha v-if="status == 2"/>
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
      status: 0
    }
  },
  async fetch () {
    const res = await this.$axios.$get('/account/getStatus')
      this.status = res.status;
  },
  methods: {
  },
}
</script>
<style>

</style>