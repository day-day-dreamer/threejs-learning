
import { Map, View } from "ol";
import { fromLonLat, transform } from "ol/proj";
import { Tile as TileLayer } from "ol/layer";
import { XYZ } from "ol/source";
import { ORIGIN_POINT } from '@/common/constant'

const tileLayer = new TileLayer({
  // 创建一个使用Open Street Map地图源的瓦片图层
  // source: new OSM(),
  // 加载高德地图
  visible: true,
  source: new XYZ({
    url: "https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
    // url: "http://localhost:8080/TILES/{z}/{x}/{y}.png",
    // maxZoom: 15,
    // minZoom: 12,
    // projection: 'EPSG:3857',
    // crossOrigin: "anonymous", //离线瓦片跨域处理
  }),
})

const useInitMap = ({
  target,
  otherLayers = [],
  viewOpts = {},
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
      // center: transform([120.45136287399997, 36.8088809535], "EPSG:4326", "EPSG:3857"),
      zoom: 14,
      // maxZoom: 15,
      // minZoom: 12,
      minResolution: 0.5,
      ...viewOpts,
    }),
  });

  return {mapInstance, tileLayer}
}

export default useInitMap