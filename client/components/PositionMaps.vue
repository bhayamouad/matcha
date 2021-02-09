<template>
    <div>
        <GmapMap
        :options="defaultMapOptions"
          :center="position"
          :zoom="15"
          map-type-id="terrain"
          style="width: 100%; height: 500px"
        >
          <GmapMarker
            :position="position"
            :draggable="true"
            @drag="updateCoordinates"
            :icon="{ url: require('../assets/maps-and-flags.svg')}"
            
          />
        </GmapMap>
    </div>
</template>

<script>


export default {
   data() {
       return {
           position:{lat:32.882183, lng:-6.897851},
           newPosition:{lat:null,lng:null},
           defaultMapOptions: {
	        clickableIcons: false,
	        streetViewControl: false,
	        panControlOptions: false,
	        gestureHandling: 'greedy'
	      }
       }
   },
  methods: {
        updateCoordinates(location) {
            this.newPosition = {
                lat: location.latLng.lat(),
                lng: location.latLng.lng(),
            }
        },
        savePosition(){
            return this.newPosition
        }

  },
}
</script>

<style lang="scss" scoped>

</style>