<template>
  <div>
    <b-tabs type="is-boxed" v-model="active">
      <b-tab-item>
        <template #header>
          <b-icon icon="image"></b-icon>
          <span>Pictures</span>
        </template>
        <image-upload ref="images" />
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="account"></b-icon>
          <span>Profile</span>
        </template>
        <set-profile ref="profile" />
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="lock"></b-icon>
          <span>Change Password</span>
        </template>
        <change-password :isPass="isPass"></change-password>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="map-marker"></b-icon>
          <span>Location</span>
        </template>
        <position-maps ref="location"/>
      </b-tab-item>
    </b-tabs>
    <div v-if="active!=2" class="field is-grouped is-grouped-centered">
      <p class="control">
        <button :disabled="btnActive" class="button is-primary" @click="save">Save </button>
      </p>
    </div>
  </div>
</template>

<script>
import SetProfile from "@/components/SetProfile.vue";
import ImageUpload from "@/components/ImageUploadBox.vue";
import PositionMaps from "@/components/PositionMaps.vue"

export default {
  components: {
    SetProfile,
    ImageUpload,
    PositionMaps
  },
  middleware: 'redirect',
  layout: "home",
  data() {
    return {
      error: null,
      active: 0,
      isPass: null,
      btnActive: null
    };
  },
  async fetch(){
        const res = await this.$axios.$get("/account/isOauth")
        this.isPass = res.pass
        this.btnActive = (this.$refs.images.btnActive || this.$refs.profile.btnActive || this.$refs.location.btnActive) ? false : true 
        
  },
  updated(){
      console.log(this.$refs.images.btnActive,this.$refs.profile.btnActive,this.$refs.location.btnActive);
  },

  methods: {
    // btnChange(){
    //     Vue.nextTick()
    //       .then( () => {
    //           console.log(this.$refs.images.btnActive,this.$refs.profile.btnActive,this.$refs.location.btnActive);
    //       })
    // },
    async save() {
      let check = null;
      if (this.active === 1) {
        check = await this.$refs.profile.setProfile();
        if (check)
          this.$snoast.toast(
            this.$buefy,
            "your Profile was changed successfuly",
            "is-success"
          );
      }
      if(this.active === 3){
        const res = await this.$refs.location.savePosition()
        if(res === 'success')
          this.$snoast.toast(this.$buefy, `your position was changed`, "is-success")
        else
          this.$snoast.toast(
                this.$buefy,
                res,
                "is-danger"
              );
      }
      if(this.active === 0) {
        check = await this.$refs.images.saveImages();
        if (check)
          this.$snoast.toast(
            this.$buefy,
            "your Images were changed successfuly",
            "is-success"
          );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>