<template>
  <RightSide>
    <div class="search-box">
      <el-input
        v-model="keywords"
        class="w-50 m-2"
        placeholder="搜索"
        :prefix-icon="Search"
        size="large"
        @input="onInput"
        @change="onSearch"
      />
      <div class="search-result" v-if="searchRes.length">
        <div
          class="res-item"
          v-for="item in searchRes"
          :key="item.id"
          @click="flyTo(item.location)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </RightSide>
  <MainMap @get-instance="getInstance"></MainMap>
</template>
<script setup>
import MainMap from "@/components/Map/map.vue";
import RightSide from "@/components/RightSide/rightSide.vue";
import { Search } from "@element-plus/icons-vue";
import axios from "axios";
import { ref } from "vue";
import useCreateMark from "@/hooks/useCreateMark.js";
import { debounce } from "lodash"

const keywords = ref("");
const searchRes = ref([]);
let map;

const onSearch = () => {
  searchRes.value = "";
  // 采用高德定位api
  axios
    .get("https://restapi.amap.com/v3/place/text", {
      params: {
        keywords: keywords.value,
        city: "370303",
        page: 1,
        key: "a54543e9f579aa035a1eb31d417408ac",
      },
    })
    .then((res) => {
      const { data } = res || {};
      const { pois, status } = data || {};
      if (status === "1" && pois?.length) {
        searchRes.value = pois.slice(0, 10);
      }
    });
};
const onInput = debounce(onSearch, 300)
const flyTo = (location) => {
  const layers = map.getLayers();
  // 清除上一个定位的图层
  if (layers?.array_.length > 1) {
    layers.array_[1].getSource().clear();
    map.removeLayer(layers.array_[1]);
  }
  const view = map.getView();
  const { vectorLayer } = useCreateMark([location.split(",")]);
  map.addLayer(vectorLayer);
  const feature = vectorLayer.getSource().getFeatures()[0];
  const point = feature.getGeometry();
  view.fit(point, {
    nearest: true,
    minResolution: 0.5, // 最小分辨率
    // duration: 1.5,
  });
};

const getInstance = ({ mapInstance }) => {
  map = mapInstance;
};
</script>
<style scoped lang="less">
.search-box {
  position: relative;
  .search-result {
    position: absolute;
    top: 40px;
    padding: 10px;
    display: flex;
    z-index: 10;
    flex-direction: column;
    background: #fff;
    left: 0;
    right: 0;
    border-radius: 5px;
  }
  .res-item {
    color: #333;
    padding: 5px;
    border-bottom: 1px solid #efefef;
    cursor: pointer;
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
