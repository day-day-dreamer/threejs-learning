/*
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-07-19 16:39:41
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-08-28 16:09:17
 */
/*
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-05-05 10:10:02
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-07-21 15:09:04
 */
import EmptyRouterView from "@/components/RouterView/EmptyRouterView.vue"
const routes = [
  {
    path: "/",
    name: "index",
    component: () => import('@/views/home/home.vue'),
    meta: {
      title: "首页",
      activePath: "/"
    }
  },
  {
    path: "/base",
    component: EmptyRouterView,
    meta: {
      title: "基础"
    },
    children: [
      {
        path: 'init',
        name: "base_init",
        component: () => import("@/views/base/init.vue"),
        meta: {
          title: "初始化",
          activePath: "/base/init"

        }
      },
      {
        path: 'drawLine',
        name: "base_drawLine",
        component: () => import("@/views/base/drawLine.vue"),
        meta: {
          title: "画线",
          activePath: "/base/drawLine"

        }
      },
      {
        path: 'load3Dmodel',
        name: "base_load3Dmodel",
        component: () => import("@/views/base/load3Dmodel.vue"),
        meta: {
          title: "3D模型",
          activePath: "/base/load3Dmodel"

        }
      },
      {
        path: 'skybox',
        name: "base_skybox",
        component: () => import("@/views/base/skybox.vue"),
        meta: {
          title: "天空盒",
          activePath: "/base/skybox"

        }
      }

    ]

  },
  {
    path: "/particle",
    component: EmptyRouterView,
    meta: {
      title: "粒子系统"
    },
    children: [
      {
        path: 'fire',
        name: "particle_fire",
        component: () => import("@/views/particle/fire.vue"),
        meta: {
          title: "火焰",
          activePath: "/particle/fire"

        }
      },


    ]

  },
  {
    path: "/example",
    component: EmptyRouterView,
    meta: {
      title: "场景示例"
    },
    children: [
      {
        path: 'vr',
        name: "example_vr",
        component: () => import("@/views/example/vr.vue"),
        meta: {
          title: "vr看房",
          activePath: "/example/vr"

        }
      },
      {
        path: 'island',
        name: "example_island",
        component: () => import("@/views/example/island.vue"),
        meta: {
          title: "岛屿",
          activePath: "/example/island"

        }
      },
      {
        path: 'park',
        name: "example_park",
        component: () => import("@/views/example//park/park.vue"),
        meta: {
          title: "园区",
          activePath: "/example/park"
        }
      },
    ]

  },
];

export default routes