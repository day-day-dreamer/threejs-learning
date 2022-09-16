<template>
  <RightSide>
    <label for="radius">球体半径：</label>
    <input
      type="range"
      min="1"
      max="50"
      step="1"
      v-model="radius"
      @input="radiusHandler"
      @change="radiusHandler"
    />
    <label for="blur">模糊半径：</label>
    <input type="range" min="1" max="50" step="1" v-model="blur" @input="blurHandler" @change="blurHandler" />
  </RightSide>
  <MainMap :other-layers="[heatMapLayer]"></MainMap>
</template>
<script setup>
import MainMap from "@/components/Map/map.vue";
import RightSide from "@/components/RightSide/rightSide.vue";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Heatmap as HeatmapLayer } from "ol/layer";
import { ref } from "vue";


const radius = ref(20);
const blur = ref(25);

const vectorSource = new VectorSource({
  url: "/static/demo-data/Export_Output_2.json",
  format: new GeoJSON(),
});
//定义热力图图层
const heatMapLayer = new HeatmapLayer({
  source: vectorSource,
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10),
  // 权重
  weight: (feature) => {
    const val = feature.get("num");
    return val;
  },
});

const blurHandler = () => {
  heatMapLayer.setBlur(parseInt(blur.value, 10));
};
const radiusHandler = () => {
  heatMapLayer.setRadius(parseInt(radius.value, 10));
};
</script>
<style></style>
