<template>
<div>
    <b-button @click="toast('hi there from plugin', 'is-danger', 3000)" type="is-primary">fire1</b-button>
    <b-button @click="toast2('hi there from plugin', 'is-success', 3000)" type="is-primary">fire2</b-button>
    <b-button @click="red" type="is-danger">home</b-button>
</div>
</template>

<script>
export default {
 
  methods: {
    toast(msg, type, duration) {
      this.$snoast.toast(this.$buefy, msg, 'is-danger', 3000)
    },
    toast2(msg, type, duration) {
      this.$snoast.toast(this.$buefy, msg, 'is-success', 3000)
    },
    red(){
        // this.clear()
        this.$snoast.close()
        this.$router.push('/')
    }
  }
  
}

</script>

<style>

</style>