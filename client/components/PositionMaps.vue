<template>
  <div>
    <GmapMap
      id="map"
      ref="mapRef"
      :options="defaultMapOptions"
      :center="(!users) ? position : {lat:0,lng:0}"
      :zoom="15"
      map-type-id="terrain"
      style="width: 100%; height: 500px"
    >
      <div v-if="users">
        <GmapMarker
          :key="index"
          v-for="(user, index) in users"
          :position="{lat: user.lat, lng: user.lng}"
          :icon="{ url: require('../assets/customer.svg')}"
          @click="toggleInfoWindow(user,index)"
        />
      </div>
      <GmapMarker
        :position="(newPosition.lat)? newPosition : position"
        :draggable="draggable"
        @drag="updateCoordinates"
        :icon="{ url: require('../assets/maps-and-flags.svg')}"
      />
      <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="close"
      >
        <div v-html="infoContent"></div>
      </gmap-info-window>
      <gmap-info-window
        :options="infoOptions"
        :position="position"
        :opened="meOpen"
      >
        <div v-html="'<p>I am Here</p>'"></div>
      </gmap-info-window>
    </GmapMap>
    <div v-if="!users" class="geolocation" @click="geolocation">
      <img src="../assets/gps.svg" />
    </div>
    <div class="loader-cnt geolocation" v-if="loading"><div class="loaders"></div></div>

  </div>
</template>

<script>
export default {
  props: ["users", "distance"],
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
      loading: false,
      radius: this.distance*1000,
      draggable: this.users ? false : true,
      map: null,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      meOpen:true,
      infoContent: '',
      infoWindowPos: {lat: 0, lng: 0 },
      infoWinOpen: false,
      currentUserindex: null,
    };
  },
  async fetch() {
    const res = await this.$axios.$get("/account/getPosition");
    this.position.lat = res.position.lat;
    this.position.lng = res.position.lng;
    if(this.users)
      this.getCircle()
  },
  beforeDestroy() {
    this.$snoast.close()
  },
  methods: {
    updateCoordinates(location) {
      this.newPosition = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      }
      this.meOpen = false
    },
    async savePosition() {
      const res = await this.$axios.$put(
        "/account/setPosition",
        this.newPosition
      );
      return res.message;
    },
    geolocation() {
      this.loading= true
      navigator.geolocation.getCurrentPosition(
        position => {
          this.newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.position = this.newPosition;
          this.loading = false
        },
        error => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.$snoast.toast(
                this.$buefy,
                "User denied the request for Geolocation",
                "is-danger"
              );
              break;
            case error.POSITION_UNAVAILABLE:
              this.$snoast.toast(
                this.$buefy,
                "Location information is unavailable.",
                "is-danger"
              );
              break;
            case error.TIMEOUT:
              this.$snoast.toast(
                this.$buefy,
                "The request to get user location timed out.",
                "is-danger"
              );
              break;
            case error.UNKNOWN_ERROR:
              this.$snoast.toast(
                this.$buefy,
                "An unknown error occurred.",
                "is-danger"
              );
              break;
          }
        }
      );
    },
    getCircle() {
      this.$refs.mapRef.$mapPromise.then(map => {
        const circleOptions = {
          center: this.position,
          fillColor:'#950740',
          fillOpacity: 0.2, 
          strokeColor: '#c3073f',
          strokeOpacity: 0.1,
          map,
          radius: this.radius
        };
        const area = new google.maps.Circle(circleOptions);
        map.fitBounds(area.getBounds());
      });
    },

    toggleInfoWindow(user, index) {
        this.meOpen = false
        this.infoWindowPos = { lat: user.lat, lng: user.lng };
        this.infoContent = this.getInfoWindowContent(user);
        
        if (this.currentUserindex == index) {
          this.infoWinOpen = !this.infoWinOpen;
        }
        else {
          this.infoWinOpen = true;
          this.currentUserindex = index;
        }
      },
      getInfoWindowContent(user) {
        return (`
        <div class="card" style="width: 140px;height: 210px;">
          <div class="profile" style="height: 100%;position:relative">
            <img src="${this.$config.baseURL}/${user.images.split(',')[0]}" style="width: 100%;height: 100%;object-fit: cover;">
          </div>
          <div style="position:absolute; bottom:0px; width:100%; background-color:rgb(0, 0, 0, 0.5); height:60px; padding: 10px 0; font-size: 16px">
              <a href="/profile/${user.login}" style="color:white"><h2><span style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">${user.fname} ${user.lname}</span>, ${user.age}</h2></a>
          </div>
        </div>`)
      },
      close(){
        this.infoWinOpen=false
        this.meOpen=true
      }
      
  }
};
</script>

<style lang="scss" scoped>
#id {
  position: relative;
}

.geolocation {
  position: absolute;
  bottom: 125px;
  right: 25px;
  background-color: #fff;
  height: 40px;
}
.geolocation:hover {
  cursor: pointer;
}
.geolocation img:hover {
  content: url("../assets/gpsHover.svg");
}
.geolocation img {
  padding: 5px;
}
.loaders {
    margin: 5px;
    border: 2px solid rgba(195, 7, 63, 0.2);
    border-radius: 50%;
    border-top: 20px solid #950740;
    width: 30px;
    height: 30px;
    -webkit-animation: spin 0.5s linear infinite;
    animation: spin 0.5s linear infinite;
}
</style>