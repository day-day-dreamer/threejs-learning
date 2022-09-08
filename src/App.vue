<script setup>
// import { onMounted } from "vue";
// import { Map, View, Feature, Overlay } from "ol";
// import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
// import OSM from "ol/source/OSM";
// import { defaults as defaultControls } from "ol/control";
// import ZoomSlider from "ol/control/ZoomSlider";
// import { fromLonLat, transformExtent } from "ol/proj";
// import Text from "ol/style/Text";
// import { buffer } from "ol/extent";
// import { XYZ, Vector as VectorSource } from "ol/source";
// import { Point, Polygon, LineString, } from "ol/geom";
// import { Style, Icon, Fill, Stroke, Circle as CircleStyle } from "ol/style";
// import Geocoder from "ol-geocoder";
// import Draw from "ol/interaction/Draw";
// import {getArea, getLength} from 'ol/sphere';
// import {unByKey} from 'ol/Observable';
</script>
<template>
  <el-container>
    <el-aside>
      <Menu></Menu>
    </el-aside>
    <el-container>
      <!-- <el-header>Header</el-header> -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped>
.el-header {
  height: 30px;
}
.el-container {
  height: 100vh;
}
.el-main {
  padding: 0 !important;
  position: relative;
}
.el-aside {
  width: auto;
}
</style>
