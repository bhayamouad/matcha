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
          <b-icon icon="map-marker"></b-icon>
          <span>Location</span>
        </template>
        <position-maps ref="location"/>
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
import PositionMaps from "@/components/PositionMaps.vue"

export default {
  components: {
    SetProfile,
    ImageUpload,
    PositionMaps
  },
  layout: "home",
  data() {
    return {
      error: null,
      active: 0
    };
  },
  methods: {
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
      if(this.active === 2){
        const pos = await this.$refs.location.savePosition()
        this.$snoast.toast(
            this.$buefy,
            `your position is ${pos.lat}, ${pos.lng}`,
            "is-success"
          );
      }
      else {
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