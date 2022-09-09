
import { Map, View } from "ol";
import { fromLonLat } from "ol/proj";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { ORIGIN_POINT } from '@/common/constant'

const tileLayer = new TileLayer({
  // 创建一个使用Open Street Map地图源的瓦片图层
  // source: new OSM(),
  // 加载高德地图
  source: new XYZ({
    url: "https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
  }),
})

const useInitMap = ({
  target,
  otherLayers,
}) => {
  let mapInstance = null;
  mapInstance = new Map({
    target,
    layers: [
      tileLayer,
      ...otherLayers
    ],
    view: new View({
      center: fromLonLat(ORIGIN_POINT), // 地图中心
      zoom: 14,
      // maxZoom: 28,
      // minZoom: 1,
      minResolution: 0.5,
    }),
  });

  return {mapInstance, tileLayer}
}

export default useInitMap