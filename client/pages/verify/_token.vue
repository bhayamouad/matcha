<template>
<div>
  <loginBox></loginBox>
</div>
</template>

<script>
import loginBox from "@/components/LoginBox"
let snackb;
export default {
  mounted(){
    this.checkToken()
  },
  beforeDestroy(){
    snackb.close()
  },
  methods: {
    async checkToken(){
      const res = await this.$axios.$get(`/account/verify/${this.$route.params.token}`);
      if (res.success)
        this.verifySuccess(res.message)
      else if(res.special)
        this.verifyLink(res.message)
      else
        this.verifyError(res.message)

    },
    verifyError(msg) {
      this.$buefy.toast.open({
        duration: 5000,
        message: msg,
        type: "is-danger",
      });
    },
    verifySuccess(msg) {
      this.$buefy.toast.open({
        duration: 5000,
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