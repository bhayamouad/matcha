<template>
  <div>
    <GmapMap
      id="map"
      ref="mapRef"
      :options="defaultMapOptions"
      :center="(!users)?position:{lat:0,lng:0}"
      :zoom="15"
      map-type-id="terrain"
      style="width: 100%; height: 500px"
    >
      <div v-if="users">
        <GmapMarker
          :key="index"
          v-for="(m, index) in users"
          :position="{lat: m.lat, lng: m.lng}"
          @click="toggleInfoWindow(m,index)"/>
      </div>
      <GmapMarker
        :position="(newPosition.lat)? newPosition : position"
        :draggable="draggable"
        @drag="updateCoordinates"
        :icon="{ url: require('../assets/location.svg')}"
      />
      <!-- <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen=false"
      >
        <div v-html="infoContent"></div>
      </gmap-info-window> -->
    </GmapMap>
    <div v-if="!users" id="geolocation" @click="geolocation">
      <img src="../assets/gps.svg" />
    </div>
  </div>
</template>

<script>
export default {
  props:['users'],
  data() {
    return {
      position: { lat: 0, lng: 0 },
      newPosition: { lat: null, lng: null },
      defaultMapOptions: {
        clickableIcons: false,
        streetViewControl: false,
        panControlOptions: false,
        gestureHandling: "greedy"
      },
      draggable: (this.users) ? false : true,
      map:null
    };
  },
  async fetch() {
    const res = await this.$axios.$get("/account/getPosition");
    this.position.lat = res.position.lat;
    this.position.lng = res.position.lng;
  },
  mounted() {
      //set bounds of the map
        this.$refs.mapRef.$mapPromise.then((map) => {
          const bounds = new google.maps.LatLngBounds()
          for (let m of this.users) {
            bounds.extend({lat: m.lat, lng: m.lng})
          }
          map.fitBounds(bounds);
        });
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
    },
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