<template>
  <MainMap @get-instance="getInstance" :other-layers="[vector]"></MainMap>
</template>
<script setup>
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { Style, Icon, Stroke } from "ol/style";
import { Point } from "ol/geom";
import Draw from "ol/interaction/Draw";

import MainMap from "@/components/Map/map.vue";

const source = new VectorSource();
const styleFunction = (feature) => {
  const geometry = feature.getGeometry();
  const styles = [
    // linestring
    new Style({
      stroke: new Stroke({
        color: "#ffcc33",
        width: 2,
      }),
    }),
  ];

  geometry.forEachSegment((start, end) => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const rotation = Math.atan2(dy, dx);
    // arrows
    styles.push(
      new Style({
        geometry: new Point(end),
        image: new Icon({
          src: "/src/static/demo-icon/icon-3.png",
          anchor: [0.5, 0.5],
          rotateWithView: true,
          rotation: -rotation,
          scale: 0.2,
        }),
      })
    );
  });

  return styles;
};
const vector = new VectorLayer({
  source: source,
  style: styleFunction,
});

const getInstance = ({ mapInstance }) => {
  mapInstance.addInteraction(
    new Draw({
      source: source,
      type: "LineString",
    })
  );
};
</script>
