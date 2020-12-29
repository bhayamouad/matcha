<template>
  <section>
    <b-steps type="is-success" v-model="active">
      <b-step-item label="Account" icon="account-key"></b-step-item>
      <b-step-item label="Profile" icon="account">
        <set-profile/>
      </b-step-item>
      <b-step-item label="Social" icon="account-plus"></b-step-item>
    </b-steps>
  </section>
</template>

<script>
import SetProfile from '@/components/SetProfile.vue';

export default {
  middleware: 'authorization',
  components: {
    SetProfile
  },
  name: "HomePage",
  head() {
    return {
      title: "Matcha"
    }
  },
  data () {
    return {
      active:1
    }
  }
}
</script>
<style src="@/style/homepage.css">
</style>
