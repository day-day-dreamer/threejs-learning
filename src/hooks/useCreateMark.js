/**
 * 创建点位
 */
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Style, Icon } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";

const vectorSource = new VectorSource({ wrapX: false });
// 我们需要一个vector的layer来放置图标
const vectorLayer = new VectorLayer({
  source: vectorSource,
});
const styleMark = new Style({
  image: new Icon({
    src: "/src/static/demo-icon/icon-1.png",
    size: [100, 100],
  }),
});
/**
 * 
 * @param {Array} coordinates 例子：[[lng, lat]]
 * @returns
 */
const useCreateMark = (coordinates = []) => {
  // 创建一个Feature，并设置好在地图上的位置
  if (Array.isArray(coordinates) && coordinates.length) {
    coordinates.forEach((item) => {
      const anchor = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      // 设置样式，在样式中就可以设置图标
      anchor.setStyle(styleMark);
      // vectorLayer.getSource().removeFeature();
      // 添加到之前的创建的layer中去
      vectorLayer.getSource().addFeature(anchor);
    })
  }
  return { vectorLayer }
};

export default useCreateMark