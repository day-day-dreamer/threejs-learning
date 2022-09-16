<template>
  <MainMap @getInstance="getInstance" :other-layers="[vectorLayer]" :viewOpts="viewOpts"></MainMap>
</template>
<script setup>
import MainMap from "@/components/Map/map.vue";
import { XYZ, Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import { DragBox, Select } from "ol/interaction";
import { platformModifierKeyOnly, never } from "ol/events/condition";
import { ORIGIN_POINT } from "@/common/constant.js";

let map = null;
const viewOpts = {
  // constrainRotation: 16,
  // rotation: 90,
}
const vectorSource = new VectorSource({
  url: "/static/demo-data/zhangdian1.json",
  format: new GeoJSON(),
});
const vectorLayer = new VectorLayer({
  source: vectorSource,
});
const select = new Select({
  condition: never,
});
const selectedFeatures = select.getFeatures();
const dragBox = new DragBox({
  condition: platformModifierKeyOnly,
  // condition: always,
});
const getInstance = ({ mapInstance }) => {
  mapInstance.addInteraction(select);
  mapInstance.addInteraction(dragBox);
  map = mapInstance;
};

dragBox.on("boxend", function () {
  // features that intersect the box geometry are added to the
  // collection of selected features

  // if the view is not obliquely rotated the box geometry and
  // its extent are equalivalent so intersecting features can
  // be added directly to the collection
  // const rotation = map.getView().getRotation();
  // const oblique = rotation % (Math.PI / 2) !== 0;
  // const candidateFeatures = oblique ? [] : selectedFeatures;
  // 获取被选择的要素
  const extent = dragBox.getGeometry().getExtent();
  vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
    selectedFeatures.push(feature);
  });

  // when the view is obliquely rotated the box extent will
  // exceed its geometry so both the box and the candidate
  // feature geometries are rotated around a common anchor
  // to confirm that, with the box geometry aligned with its
  // extent, the geometries intersect
  // if (oblique) {
  //   // const anchor = ORIGIN_POINT;
  //   const anchor = [0, 0];
  //   const geometry = dragBox.getGeometry().clone();
  //   geometry.rotate(-rotation, anchor);
  //   const extent = geometry.getExtent();
  //   candidateFeatures.forEach(function (feature) {
  //     const geometry = feature.getGeometry().clone();
  //     geometry.rotate(-rotation, anchor);
  //     if (geometry.intersectsExtent(extent)) {
  //       selectedFeatures.push(feature);
  //     }
  //   });

  // }
});

// clear selection when drawing a new box and when clicking on the map
dragBox.on("boxstart", function () {
  selectedFeatures.clear();
});

// const infoBox = document.getElementById('info');

// selectedFeatures.on(['add', 'remove'], function () {
//   const names = selectedFeatures.getArray().map(function (feature) {
//     return feature.get('name');
//   });
//   if (names.length > 0) {
//     infoBox.innerHTML = names.join(', ');
//   } else {
//     infoBox.innerHTML = 'No countries selected';
//   }
// });
</script>
