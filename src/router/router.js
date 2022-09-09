import Home from '@/views/home/home.vue'
const routes = [
  {
    path: "/",
    name: "首页",
    component: Home,
  },
  {
    path: "/goOrigin",
    name: "回到原点",
    component: () => import("@/views/goOrigin/goOrigin.vue"),
  },
  {
    path: "/createMark",
    name: "打点",
    component: () => import("@/views/createMark/createMark.vue"),
  },
  {
    path: "/heatMap",
    name: "人口热力图",
    component: () => import("@/views/heatMap/heatMap.vue"),
  },
  {
    path: "/measure",
    name: "测量工具",
    component: () => import("@/views/measure/measure.vue"),
  },
  {
    path: "/draw",
    name: "绘制",
    component: () => import("@/views/draw/draw.vue"),
  },
  {
    path: "/radiate",
    name: "辐射圈",
    component: () => import("@/views/radiate/radiate.vue"),
  },
  {
    path: "/lineArrow",
    name: "箭头线",
    component: () => import("@/views/lineArrow/lineArrow.vue"),
  },
  {
    path: "/regularShapes",
    name: "规则几何图形",
    component: () => import("@/views/regularShapes/regularShapes.vue"),
  },
  {
    path: "/search",
    name: "查询",
    component: () => import("@/views/search/search.vue"),
  },
];

export default routes