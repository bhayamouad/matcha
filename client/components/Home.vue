<template>
  <section> 
    <steps v-if="status == 1"/>
    <Matcha :status="status" v-if="status > 1"/>
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
    if(!res.error)
      this.status = res.status;
    else
      this.$snoast.toast(this.$buefy, res.error, 'is-danger')
  },
  methods: {
  },
}
</script>
<style>

</style>