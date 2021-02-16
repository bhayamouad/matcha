<template>
    <div>
    <b-tabs type="is-boxed" v-model="active">
      <b-tab-item>
        <template #header>
          <b-icon icon="password"></b-icon>
          <span>Change Password</span>
        </template>
        <change-password :isPass="isPass"></change-password>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="setting"></b-icon>
          <span>Discovering</span>
        </template>
        <div>test</div>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
export default {
    layout: "home",
    data() {
        return {
            error: null,
            active: 0,
            isPass: null
        }
    },
    async fetch(){
        const res = await this.$axios.$get("/account/isOauth")
        this.isPass = res.pass
    }
}
</script>

<style lang="scss" scoped>

</style>