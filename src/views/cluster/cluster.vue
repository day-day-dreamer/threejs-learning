<template>
  <RightSide>
    <div style="margin-bottom: 10px;">
      <label for="distance" class="col-form-label">聚合距离：</label>
      <input
        id="distance"
        class="form-control-range"
        type="range"
        min="0"
        max="200"
        step="1"
        v-model="clusterVal"
        @input="distanceHandler"
        @change="distanceHandler"
      />
    </div>
    <div>
      <label for="min-distance" class="col-form-label">最小距离：</label>
      <input
        id="min-distance"
        class="form-control-range"
        type="range"
        min="0"
        max="200"
        step="1"
        v-model="minimumVal"
        @input="minDistanceHandler"
        @change="minDistanceHandler"
      />
    </div>
  </RightSide>
  <MainMap
    @get-instance="getInstance"
    :other-layers="[clustersLayer]"
  ></MainMap>
</template>
<script setup>
import MainMap from "@/components/Map/map.vue";
import { ORIGIN_POINT } from "@/common/constant.js";
import { Feature } from "ol";
import { Vector as VectorSource, Cluster } from "ol/source";
import { ref } from "vue";
import RightSide from "@/components/RightSide/rightSide.vue";
import { Vector as VectorLayer } from "ol/layer";
import { Style, Fill, Stroke, Circle as CircleStyle, Text } from "ol/style";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";

const clusterVal = ref(40);
const minimumVal = ref(20);
const count = 300;
const features = new Array(count);
for (let i = 0; i < count; ++i) {
  const coordinates = fromLonLat([
    ORIGIN_POINT[0] + Math.random() * 0.01,
    ORIGIN_POINT[1] + Math.random() * 0.01,
  ]);
  features[i] = new Feature(new Point(coordinates));
}
const source = new VectorSource({
  features: features,
});

const clusterSource = new Cluster({
  distance: parseInt(clusterVal.value, 10),
  minDistance: parseInt(minimumVal.value, 10),
  source: source,
});
const styleCache = {};
const clustersLayer = new VectorLayer({
  source: clusterSource,
  style: function (feature) {
    const size = feature.get("features").length;
    let style = styleCache[size];
    if (!style) {
      style = new Style({
        image: new CircleStyle({
          radius: 10,
          stroke: new Stroke({
            color: "#fff",
          }),
          fill: new Fill({
            color: "#3399CC",
          }),
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({
            color: "#fff",
          }),
        }),
      });
      styleCache[size] = style;
    }
    return style;
  },
});
const distanceHandler = function () {
  clusterSource.setDistance(parseInt(clusterVal.value, 10));
};

const minDistanceHandler = function () {
  clusterSource.setMinDistance(parseInt(minimumVal.value, 10));
};

const getInstance = ({ mapInstance }) => {
  mapInstance.on("click", (e) => {
    clustersLayer.getFeatures(e.pixel).then((clickedFeatures) => {
      if (clickedFeatures.length) {
        // Get clustered Coordinates
        const features = clickedFeatures[0].get("features");
        if (features.length > 1) {
          const extent = boundingExtent(
            features.map((r) => r.getGeometry().getCoordinates())
          );
          map
            .getView()
            .fit(extent, { duration: 1000, padding: [50, 50, 50, 50] });
        }
      }
    });
  });
};
</script>
