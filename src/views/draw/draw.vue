<template>
  <RightSide>
    <el-button
      v-for="item in BTN_TYPE"
      :key="item.type"
      @click="initDraw(item.type)"
      type="primary"
      class="btn"
      >{{ item.name }}</el-button
    >
  </RightSide>
  <MainMap @get-instance="getInstance" :other-layers="[lineLayer]"></MainMap>
</template>
<script setup>
import Draw from "ol/interaction/Draw";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { Style, Stroke } from "ol/style";
import { ref } from "vue";

import MainMap from "@/components/Map/map.vue";
import RightSide from "@/components/RightSide/rightSide.vue";

const BTN_TYPE = [
  {
    name: "线",
    type: "LineString",
  },
  // {
  //   name: "点",
  //   type: "Point",
  // },
  {
    name: "多边形",
    type: "Polygon",
  },
  // {
  //   name: "多个点",
  //   type: "MultiPoint",
  // },
  // {
  //   name: "多条线",
  //   type: "MultiLineString",
  // },
  // {
  //   name: "多个多边形",
  //   type: "MultiPolygon",
  // },
  {
    name: "圆",
    type: "Circle",
  },
];

const drawType = ref(BTN_TYPE[0]["type"]);

const vectorSource = new VectorSource();
// 添加一个绘制的线使用的layer
var lineLayer = new VectorLayer({
  source: vectorSource,
  style: new Style({
    stroke: new Stroke({
      color: "red",
      size: 1,
    }),
  }),
});
let map;

const getInstance = ({mapInstance}) => {
  map = mapInstance;
  initDraw(drawType.value);
};
const initDraw = (type) => {
  const draw = new Draw({
    source: vectorSource,
    type,
    freehand: true,
  });
  map.addInteraction(draw);
};
</script>
<style scoped>
.btn {
  margin-bottom: 10px;
  margin-left: 0;
  width: 100%;
}
.btn:last-child {
  margin-bottom: 0;
}
</style>
