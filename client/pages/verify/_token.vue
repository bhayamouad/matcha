<template>
<div>
  <loginBox></loginBox>
</div>
</template>

<script>
import loginBox from "@/components/LoginBox"
let snackb = null;
export default {
  mounted(){
    this.checkToken()
  },
  beforeDestroy(){
    // if(snackb)
    //   snackb.close()
  },
  methods: {
    async checkToken(){
      const res = await this.$axios.$get(`/account/verify/${this.$route.params.token}`);
      if (!res.error)
        this.verifySuccess(res.message)
      if(res.special)
        this.verifyLink(res.message)
      if (res.error && !res.special)
        this.verifyError(res.message)

    },
    verifyError(msg) {
      this.$buefy.toast.open({
        duration: 7000,
        message: msg,
        type: "is-danger",
      });
    },
    verifySuccess(msg) {
      this.$buefy.toast.open({
        duration: 7000,
        message: msg,
        type: "is-success",
      });
    },
    verifyLink(msg){
      snackb = this.$buefy.snackbar.open({
                message: msg,
                type: 'is-danger',
                position: 'is-top',
                actionText: 'Verify Now',
                indefinite: false,
                queue: true,
                duration: 1000000,
                onAction: () => {this.$router.push('/verify') } 
            })
    }
  },
  
  layout: 'auth',
  name: 'trr',
  components: {
  loginBox
  }

}
</script>

<style>

</style>