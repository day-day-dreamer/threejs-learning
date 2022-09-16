<template>
  <div id="map"></div>
</template>
<script>
import initMap from "./initMap.js";

export default {
  props: {
    otherLayers: {
      type: Array,
      default: [],
    },
    viewOpts: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    const { mapInstance, tileLayer } = initMap({
      target: "map",
      otherLayers: this.$props.otherLayers,
      viewOpts: this.$props.viewOpts,
    });
    this.$emit("getInstance", { mapInstance, tileLayer });
    window.globalMap = mapInstance;
  },
};
</script>
<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
