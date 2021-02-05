<template>
  <div>
    <b-tabs type="is-boxed" v-model="active">
      <b-tab-item>
        <template #header>
          <b-icon icon="image"></b-icon>
          <span>Pictures</span>
        </template>
        <image-upload ref="images"/>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="account"></b-icon>
          <span>Profile</span>
        </template>
        <set-profile ref="profile"/>
      </b-tab-item>
    </b-tabs>
    <div class="field is-grouped is-grouped-centered">
        <p class="control">
            <a class="button is-primary" @click="save">Save</a>
        </p>
    </div>
  </div>
</template>

<script>
import SetProfile from "@/components/SetProfile.vue";
import ImageUpload from "@/components/ImageUploadBox.vue";

export default {
  components: {
    SetProfile,
    ImageUpload
  },
  layout: "home",
  data() {
    return {
        active:0
    };
  },
  methods: {
      async save(){
          if(this.active){
              const check = await this.$refs.profile.setProfile()
              if (!check) this.$snoast.toast(this.$buefy, "Oups There is an Error", 'is-danger')
              else this.$snoast.toast(this.$buefy, "your Profile was changed successfuly", 'is-success')
          }
          else{
              const check = await this.$refs.images.saveImages()
              if (!check) this.$snoast.toast(this.$buefy, "Oups There is an Error", 'is-danger')
              else this.$snoast.toast(this.$buefy, "your Images were changed successfuly", 'is-success')
          }
      }
  },
};
</script>

<style lang="scss" scoped>
</style>