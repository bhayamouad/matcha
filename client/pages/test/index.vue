<template>
<div>
    <b-button @click="fire1" type="is-primary">fire1</b-button>
    <b-button @click="fire2" type="is-primary">fire2</b-button>
    <b-button @click="red" type="is-danger">home</b-button>
</div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations({
      clear: 'toasts/clear',
      add: 'toasts/add'
    }),
    fire1(msg) {
    this.clear()
      const ref = this.$buefy.toast.open({
        duration: 7000,
        message: "test",
        type: "is-danger",
      });
      this.add(ref.close)

    },
    fire2(msg) {
        this.clear()
      const ref = this.$buefy.toast.open({
        duration: 7000,
        message: 'test',
        type: "is-success",
      });
        this.add(ref.close)
    },
    red(){
        this.clear()
        this.$router.push('/')
    }
  }
  
}

</script>

<style>
.done {
  text-decoration: line-through;
}
</style>