<template>
  <MainMap @get-instance="getInstance" :other-layers="[vectorLayer]"></MainMap>
</template>

<script setup>
import MainMap from "@/components/Map/map.vue";
import { Style, Fill, Stroke, RegularShape } from "ol/style";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { ORIGIN_POINT } from "@/common/constant.js";
import { fromLonLat } from "ol/proj";

const stroke = new Stroke({ color: "black", width: 2 });
const fill = new Fill({ color: "red" });

const styles = {
  square: new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      points: 4,
      radius: 10,
      angle: Math.PI / 4,
    }),
  }),
  rectangle: new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      radius: 10 / Math.SQRT2,
      radius2: 10,
      points: 4,
      angle: 0,
      scale: [1, 0.5],
    }),
  }),
  triangle: new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      points: 3,
      radius: 10,
      rotation: Math.PI / 4,
      angle: 0,
    }),
  }),
  star: new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      points: 5,
      radius: 10,
      radius2: 4,
      angle: 0,
    }),
  }),
  cross: new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      points: 4,
      radius: 10,
      radius2: 0,
      angle: 0,
    }),
  }),
  x: new Style({
    image: new RegularShape({
      fill: fill,
      stroke: stroke,
      points: 4,
      radius: 10,
      radius2: 0,
      angle: Math.PI / 4,
    }),
  }),
  stacked: [
    new Style({
      image: new RegularShape({
        fill: fill,
        stroke: stroke,
        points: 4,
        radius: 5,
        angle: Math.PI / 4,
        displacement: [0, 10],
      }),
    }),
    new Style({
      image: new RegularShape({
        fill: fill,
        stroke: stroke,
        points: 4,
        radius: 10,
        angle: Math.PI / 4,
      }),
    }),
  ],
};
const styleKeys = [
  "x",
  "cross",
  "star",
  "triangle",
  "square",
  "rectangle",
  "stacked",
];
const count = 10;
const features = new Array(count);
for (let i = 0; i < count; ++i) {
  const coordinates = fromLonLat([
    ORIGIN_POINT[0] + Math.random() * 0.01,
    ORIGIN_POINT[1] + Math.random() * 0.01,
  ]);
  features[i] = new Feature(new Point(coordinates));
  features[i].setStyle(
    styles[styleKeys[Math.floor(Math.random() * styleKeys.length)]]
  );
}
const source = new VectorSource({
  features: features,
});

const vectorLayer = new VectorLayer({
  source: source,
});
</script>
