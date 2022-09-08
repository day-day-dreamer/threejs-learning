<template>
  <RightSide>
    <el-button class="btn" type="primary" @click="createMark">打点</el-button>
  </RightSide>
  <MainMap :other-layers="[vectorLayer]"></MainMap>
</template>
<script setup>
import MainMap from "@/components/Map/map.vue";
import RightSide from "@/components/RightSide/rightSide.vue";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Style, Icon } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { ORIGIN_POINT } from "@/common/constant.js";

const vectorSource = new VectorSource({ wrapX: false });
// 我们需要一个vector的layer来放置图标
const vectorLayer = new VectorLayer({
  source: vectorSource,
});
const styleMark = new Style({
  image: new Icon({
    src: "/src/static/demo-icon/icon-1.png",
    size: [100, 100],
  }),
});
const createMark = () => {
  // 创建一个Feature，并设置好在地图上的位置
  for (let i = 0; i < 6; i++) {
    const lng = ORIGIN_POINT[0] + Math.random() * 0.01;
    const lat = ORIGIN_POINT[1] + Math.random() * 0.01;
    const anchor = new Feature({
      geometry: new Point(fromLonLat([lng, lat])),
    });
    // 设置样式，在样式中就可以设置图标
    anchor.setStyle(styleMark);
    // 添加到之前的创建的layer中去
    vectorLayer.getSource().addFeature(anchor);
  }
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
