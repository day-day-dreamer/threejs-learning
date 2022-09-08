<template>
  <div class="bac">
    <el-button type="primary" @click="goOld">回到原点</el-button>
  </div>
  <MainMap @get-instance="getInstance"></MainMap>
</template>
<script setup>
import { fromLonLat } from "ol/proj";
import { ORIGIN_POINT } from "@/common/constant.js";

import MainMap from "@/components/Map/map.vue";

let map = null;
const getInstance = ({mapInstance}) => {
  map = mapInstance;
};
const goOld = () => {
  var view = map.getView();
  // 设置地图中心为淄博的坐标，即可让地图移动到淄博
  view.setCenter(fromLonLat(ORIGIN_POINT));
};
</script>
<style scoped>
.bac {
  background: rgba(0, 0, 0, 0.4);
}
</style>
