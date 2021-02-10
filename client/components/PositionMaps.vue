<template>
  <div>
    <GmapMap
      id="map"
      :options="defaultMapOptions"
      v-if="position.lat || position.lng"
      :center="position"
      :zoom="15"
      map-type-id="terrain"
      style="width: 100%; height: 500px"
    >
      <GmapMarker
        :position="(newPosition.lat)? newPosition : position"
        :draggable="true"
        @drag="updateCoordinates"
        :icon="{ url: require('../assets/maps-and-flags.svg')}"
      />
    </GmapMap>
    <div id="geolocation" @click="geolocation">
      <img src="../assets/gps.svg" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      position: { lat: null, lng: null },
      newPosition: { lat: null, lng: null },
      defaultMapOptions: {
        clickableIcons: false,
        streetViewControl: false,
        panControlOptions: false,
        gestureHandling: "greedy"
      }
    };
  },
  async fetch() {
    const res = await this.$axios.$get("/account/getPosition");
    this.position.lat = res.position.lat;
    this.position.lng = res.position.lng;
  },
  methods: {
    updateCoordinates(location) {
      this.newPosition = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      };
    },
    async savePosition() {
      const res = await this.$axios.$put(
        "/account/setPosition",
        this.newPosition
      );
      return res.message;
    },
    geolocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.position = this.newPosition;
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.$snoast.toast(this.$buefy, "User denied the request for Geolocation", 'is-danger')
              break;
            case error.POSITION_UNAVAILABLE:
                this.$snoast.toast(this.$buefy, "Location information is unavailable.", 'is-danger')
                break;
            case error.TIMEOUT:
                this.$snoast.toast(this.$buefy, "The request to get user location timed out.", 'is-danger')
              break;
            case error.UNKNOWN_ERROR:
                this.$snoast.toast(this.$buefy, "An unknown error occurred.", 'is-danger')
              break;
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
#id {
  position: relative;
}
#geolocation {
  position: absolute;
  bottom: 125px;
  right: 25px;
  background-color: #fff;
  height: 40px;
}
#geolocation:hover {
  cursor: pointer;
}
#geolocation img:hover {
  content: url("../assets/gpsHover.svg");
}
#geolocation img {
  padding: 5px;
}
</style>