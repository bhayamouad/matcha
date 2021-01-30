<template>
  <div class="visitorpage">
        <div  class="welcome-msg">
                
            <div class="the-msg">
                <span id="slogan">
                    Online <br> Dating, at it's <br> finest
                </span>
                <br><br>
                <span id="msg-txt">
                    <!-- 😂 Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    when an unknown printer took a galley of type and scrambled it to make a type specimen book. -->
                    <img src="@/assets/love.svg">
                    
                    " If you’re looking for love 🥰, want to start dating, or just keep it casual 🍆 🍑, you need to be on Matcha 🔥 "
                    <!-- <br><br>
                    💞 🍆🍆🍆🍆 Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,  -->

                    
                </span>
            </div>
        </div>
        <div class="action-box">
            <nuxt />
        </div>
</div>
</template>

<script>

export default {
middleware: 'outauth',
head() {
    return {
      title: "Matcha - Welcome",
    };
  },
data(){
    return{
        status: this.$store.state.auth.loggedIn
    }
},
}
</script>
<style src="@/style/auth.css">

</style>
