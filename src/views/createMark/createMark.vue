<template>
  <RightSide>
    <el-button class="btn" type="primary" @click="createMark">打点</el-button>
  </RightSide>
  <MainMap @getInstance="getInstance"></MainMap>
</template>
<script setup>
import MainMap from "@/components/Map/map.vue";
import RightSide from "@/components/RightSide/rightSide.vue";
import { ORIGIN_POINT } from "@/common/constant.js";
import useCreateMark from '@/hooks/useCreateMark.js'
import { transform } from "ol/proj";

let map;
const getInstance = ({mapInstance}) => {
  map = mapInstance
}
const createMark = () => {
  let coordinates = []
  // 创建一个Feature，并设置好在地图上的位置
  for (let i = 0; i < 6; i++) {
    const lng = ORIGIN_POINT[0] + Math.random() * 0.01;
    const lat = ORIGIN_POINT[1] + Math.random() * 0.01;
    coordinates.push([lng, lat])
  }
  const { vectorLayer } = useCreateMark(coordinates)
  map.removeLayer(vectorLayer)
  map.addLayer(vectorLayer)
  map.on("click", (event) => {
    const feature = map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      return feature
    })
    if (feature) {
      console.log("----", transform(feature.getGeometry().getCoordinates(), 'EPSG:3857','EPSG:4326'))
    }
  })
};
</script>
<style scoped lang="less">
.btn {
  margin-bottom: 10px;
  width: 100%;
}
.btn:last-child {
  margin-bottom: 0;
}
</style>
