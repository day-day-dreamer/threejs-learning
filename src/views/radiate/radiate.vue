<template>
  <!-- <el-button @click="onRender">render</el-button> -->
  <MainMap
    @get-instance="getInstance"
    :other-layers="[vectorLayer]"
  ></MainMap>
  <!-- <div id="map"></div> -->
</template>
<script setup>
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { Style, Icon, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import { Map, View, Feature, Overlay } from "ol";
import { Point, Polygon, LineString } from "ol/geom";
import { fromLonLat, transformExtent } from "ol/proj";
import {unByKey} from 'ol/Observable';
import {getVectorContext} from 'ol/render';
import {easeOut} from 'ol/easing';

import MainMap from "@/components/Map/map.vue";
import { ORIGIN_POINT } from "@/common/constant.js";
import { onMounted, onUnmounted, ref } from "vue";

const source = new VectorSource({
  wrapX: false,
});
const vectorLayer = new VectorLayer({
  source: source,
});

function addRandomFeature() {
  const geom = new Point(fromLonLat(ORIGIN_POINT));
  const feature = new Feature(geom);
  source.addFeature(feature);
}
const duration = 3000;
function flash(feature, tileLayer, map) {
  const start = Date.now();
  const flashGeom = feature.getGeometry().clone();
  const listenerKey = tileLayer.on('postrender', animate);
  const _map = map

  function animate(event) {
    const frameState = event.frameState;
    const elapsed = frameState.time - start;
    if (elapsed >= duration) {
      unByKey(listenerKey);
      return;
    }
    const vectorContext = getVectorContext(event);
    const elapsedRatio = elapsed / duration;
    // radius will be 5 at start and 30 at end.
    const radius = easeOut(elapsedRatio) * 25 + 5;
    const opacity = easeOut(1 - elapsedRatio);

    const style = new Style({
      image: new CircleStyle({
        radius: radius,
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, ' + opacity + ')',
          width: 0.25 + opacity,
        }),
      }),
    });

    vectorContext.setStyle(style);
    vectorContext.drawGeometry(flashGeom);
    // tell OpenLayers to continue postrender animation
    _map.render();
  }
}



const timer = setInterval(addRandomFeature, 1000);
const getInstance = ({mapInstance, tileLayer}) => {
  const map = mapInstance;
  source.on('addfeature', function (e) {
  flash(e.feature, tileLayer, map);
});
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

//定义一个矢量图层，用于打点
// const pointAnimationLayer = new VectorLayer({
//   source: new VectorSource(),
//   style: new Style({
//     image: new CircleStyle({
//       fill: new Fill({
//         color: "rgba(220,20,60)",
//       }),
//       radius: 60,
//     }),
//   }),
// });

// const ft = new Feature({
//   geometry: new Point(ORIGIN_POINT),
// });
// pointAnimationLayer.getSource().addFeature(ft);
// // map.value.on('postcompose',animation);

// //样式中的半径变量，通过不断刷新点样式的半径来实现点动态扩散
// var radius = 1;
// //动画
// const animation = (event) => {
//   if (radius >= 20) {
//     radius = 0;
//   }
//   var opacity = (20 - radius) * (1 / 20); //不透明度
//   var pointStyle = new Style({
//     image: new CircleStyle({
//       radius: radius,
//       stroke: new Stroke({
//         color: "rgba(220,20,60" + opacity + ")",
//         width: 4 - radius / 10,
//       }),
//     }),
//   });
//   var features = pointAnimationLayer.getSource().getFeatures();
//   var vectorContext = event.vectorContext;
//   vectorContext.setStyle(pointStyle);
//   features.forEach((element) => {
//     var geom = element.getGeometry();
//     vectorContext.drawGeometry(geom);
//   });
//   radius = radius + 0.3;
//   //触发map的postcompose事件
//   map.render();
// };


</script>

<style scoped>
  /* #map {
    width: 100%;
    height: 100%;
  } */
  </style>
