<template>
  <div>
    <loginBox></loginBox>
  </div>
</template>

<script>
import loginBox from "@/components/LoginBox";
export default {
  mounted() {
    this.checkToken();
  },
  methods: {
    async checkToken() {
      const res = await this.$axios.$get(
        `/account/verify/${this.$route.params.token}`
      );
      if (!res.error)
        this.$snoast.toast(this.$buefy, res.message, "is-success");
      if (res.special)
        this.$snoast.snackbar(this.$buefy,res.message,'is-danger','Verify Now','/verify')
    }
  },

  layout: "auth",
  name: "verify token",
  components: {
    loginBox
  }
};
</script>

<style>
</style>