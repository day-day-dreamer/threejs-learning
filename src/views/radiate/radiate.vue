<template>
  <MainMap @get-instance="getInstance" :other-layers="[vectorLayer]"></MainMap>
</template>
<script setup>
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Fill, Circle as CircleStyle } from "ol/style";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { unByKey } from "ol/Observable";
import { getVectorContext } from "ol/render";
import { easeOut } from "ol/easing";

import MainMap from "@/components/Map/map.vue";
import { ORIGIN_POINT } from "@/common/constant.js";
import { onUnmounted } from "vue";

const source = new VectorSource({
  wrapX: false,
});
const vectorLayer = new VectorLayer({
  source: source,
});

function addRandomFeature() {
  const geom = new Point(fromLonLat(ORIGIN_POINT));
  const feature = new Feature(geom);
  // 给点设置样式
  feature.setStyle(
    new Style({
      image: new CircleStyle({
        radius: 0,
      })
    })
  )
  source.addFeature(feature);
}
const duration = 3000;
function flash(feature, tileLayer, map) {
  const start = Date.now();
  const flashGeom = feature.getGeometry().clone();
  const listenerKey = tileLayer.on("postrender", animate);
  const _map = map;

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
    const radius = easeOut(elapsedRatio) * 30;
    const opacity = easeOut(1 - elapsedRatio);

    const style = new Style({
      image: new CircleStyle({
        radius: radius,
        // stroke: new Stroke({
        //   color: "rgba(255, 0, 0, " + opacity + ")",
        //   width: 0.25 + opacity,
        // }),
        fill: new Fill({
          color: "rgba(255, 0, 0, " + opacity + ")",
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
const getInstance = ({ mapInstance, tileLayer }) => {
  const map = mapInstance;
  source.on("addfeature", function (e) {
    flash(e.feature, tileLayer, map);
  });
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped></style>
