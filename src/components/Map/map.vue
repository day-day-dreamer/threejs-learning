<template>
  <div id="map"></div>
</template>
<script>
import initMap from "./initMap.js"

export default {
  props: {
    otherLayers: {
      type: Array,
      default: [],
    },
  },
  mounted() {
    const {mapInstance, tileLayer} = initMap({
      target: "map",
      otherLayers: this.$props.otherLayers,
    })
    this.$emit("getInstance", {mapInstance, tileLayer})
  }
}

</script>
<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
