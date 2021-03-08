<template>
  <div>
    <loginBox ></loginBox>
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
      else{
        if (res.special)
          this.$snoast.snackbar(this.$buefy,res.error,'is-danger','Verify Now','/verify')
        else
          this.$snoast.toast(this.$buefy, res.error, 'is-danger')
      }
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