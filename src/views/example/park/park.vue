<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-08-28 16:06:00
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-09-13 14:56:37
-->
<template>
  <div id="jindu-text-con" v-if="progressBarShow">
    正在加载模型请稍等：<span id="jindu-text">{{ progressText }}</span>
    <div class="jindu-con">
      <div id="jindu" :style="{ width: progressText }"></div>
    </div>
  </div>
  <video id="videoContainer"></video>
  <div id="container" ref="container"></div>
  <div class="operate-box">
    <el-button type="warning" @click="onReset">场景重置</el-button>
    <el-button type="warning" @click="onChangeTime">{{ timeText }}</el-button>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from "three";
import Viewer from '@/common/threeModules/Viewer';
import SkyBoxs from '@/common/threeModules/SkyBoxs';
import Lights from '@/common/threeModules/Lights';
import ModelLoader from '@/common/threeModules/ModelLoader';
import Labels from '@/common/threeModules/Labels';
import gsap from "gsap";

let viewer = null
let cityv1 = null
let car = null
let carLabel = null
let officeLabel = null
let officeBuild = null
let oldOfficeBuild = {}
let curve = null
let Mesh26 = null
let timeen = {}
let modelLoader = null
let labelIns = null // 标签实例
let laboratoryBuild = {}
let laboratoryBuildClone = {}
let videoTextTure = null // 视频纹理
let curFloorName = "" // 当前鼠标点击选中的楼层name
let modelMoveName = "" // 当前鼠标移动过程中选中的模型name
let selectedFloorName = "" // 已经选中过的楼层name
let isSplit = false // 楼体是否分层
let lastIndex // 记录上一次点击的楼层index
let skyBoxs = null
const sceneList = ['实验楼']
const TimeNums = {
  "day": "白天模式",
  "night": "夜间模式"
}


let progress = 0; // 物体运动时在运动路径的初始位置，范围0~1
const velocity = 0.001; // 影响运动速率的一个值，范围0~1，需要和渲染频率结合计算才能得到真正的速率
const officeFloorList = Array(6).fill(0).map((item, index) => `zuo${index}`) // 办公室楼层

const isopen = ref(false)
const progressText = ref("0%")
const progressBarShow = ref(true)
const isDriver = ref(false)
const timeText = ref(TimeNums.night)
onMounted(() => {
  init()
})
const init = () => {
  viewer = new Viewer('container')
  skyBoxs = new SkyBoxs(viewer) // 创建天空盒
  viewer.camera.position.set(17, 10, 52)
  viewer.controls.maxPolarAngle = Math.PI / 2.1 // 限制controls的上下角度范围

  const lights = new Lights(viewer)
  const ambientLight = lights.addAmbientLight() // 添加环境光
  ambientLight.setOption({
    color: 0xffffff,
    intensity: 1, // 环境光强度
  })
  // // 添加平行光
  lights.addDirectionalLight([100, 100, -10], {
    color: 'rgb(253,253,253)',
    intensity: 3,
    castShadow: true, // 是否投射阴影
  })
  modelLoader = new ModelLoader(viewer)

  labelIns = new Labels(viewer)

  viewer.addAxis()

  // 添加状态检测
  viewer.addStats()
  // 初始化视频纹理
  initVideoTexture()
  // 初始化车辆
  loadCar()
  // 初始化停车场栅栏
  initFence()
  // 加载办公大厅
  loadOfficeBuild()
  // 加载实验楼
  loadLaboratoryBuild()
  // 加载广告牌
  loadBillBoard()
  // 加载人
  loadPeople()
  // 加载路灯
  loadLamp()
  // 加载树
  loadTree()
  // 办公楼鼠标移动效果
  officeMouseMove()
  // 办公楼点击
  officeFloorClick()
}
const onChangeTime = () => {
  if (timeText.value === TimeNums.night) {
    skyBoxs.setSkybox("night")
    timeText.value = "白天模式"
  } else {
    skyBoxs.setSkybox("day")
    timeText.value = "夜间模式"
  }
}
/**
 * 初始化视频纹理
 */
const initVideoTexture = () => {
  const video = document.getElementById('videoContainer')
  video.src = "/video/bi.mp4"
  video.autoplay = "autoplay"
  video.loop = "loop"
  video.muted = "muted"
  videoTextTure = new THREE.VideoTexture(video)
}
/**
 * 加载人
 */
const loadPeople = () => {
  modelLoader.loadModelToScene('/glb/ren.glb', (model) => {
    model.openCastShadow()
    model.object.position.set(13, 0, 15)
    model.object.name = '人'
    model.startAnimal(1)
    model.cloneModel([25, 0, 29]).startAnimal()
  })
}
/**
 * 加载路灯
 */
const loadLamp = () => {
  modelLoader.loadModelToScene('/glb/lightpostDouble.glb', (model) => {
    model.openCastShadow()
    model.object.position.set(23, 0, 29)
    model.object.scale.set(1, 3, 1)
    model.object.name = '路灯'
    model.cloneModel([20, 0, 29])
    model.cloneModel([17, 0, 29])
    model.cloneModel([14, 0, 29])
    model.cloneModel([9, 0, 29])
    model.cloneModel([6, 0, 29])
  })
}

/**
 * 初始化停车场栅栏
 */
const initFence = () => {
  modelLoader.loadModelToScene('/glb/city-v1.glb', (model) => {
    model.object.name = "cityv1"
    model.openCastShadow() // 开启投射阴影
    model.openReceiveShadow() // 开启接收阴影
    model.object.children.forEach((item) => {
      // 门口栅栏动画
      if (item.name === 'Mesh26') {
        Mesh26 = item
        gsap.to(item.scale, {
          x: item.scale.x / 8,
          duration: 5,
          ease: "power1.inOut",
          onComplete: () => {
            makeCurve()
            isopen.value = true
          }
        })
      }
    })
    timeen = {
      fun: moveOnCurve,
      content: car
    }
    viewer.addAnimate(timeen)
    cityv1 = model.object.clone()
  }, pgs => {
    pgs = Math.floor(pgs * 100)
    progressText.value = pgs + "%"
    if (pgs === 100) {
      progressBarShow.value = false
    }
  }, (error) => {
    console.log('----加载city-v1.glb报错---', error)
  })
}
/**
 * 加载广告牌
 */
const loadBillBoard = () => {
  modelLoader.loadModelToScene('/glb/billboard.glb', (model) => {
    model.openCastShadow() // 开启投射阴影
    // model.openReceiveShadow()
    model.object.position.set(4, -20, -35)
    model.object.rotateY(-Math.PI / 2)
    model.object.scale.set(2.7, 2.7, 2.7)
    model.object.name = '广告牌'
    const object6 = model.object.getObjectByName("Object_6")
    object6.material = new THREE.MeshBasicMaterial({
      map: videoTextTure,
      side: THREE.DoubleSide,
      transparent: true,
    })
    // const bbox = model.getBox()

  })
}
/**
 * 加载办公大厅
 */
const loadOfficeBuild = () => {
  modelLoader.loadModelToScene('/glb/officeBuild.glb', model => {
    console.log("----model----", model)
    officeBuild = model
    officeBuild.openCastShadow()
    officeBuild.openReceiveShadow()
    //旋转360度
    officeBuild.object.rotation.y = Math.PI
    officeBuild.object.position.set(16, 0, -5)
    officeBuild.object.scale.set(0.2, 0.2, 0.2)
    officeBuild.object.name = '办公大厅'
    officeBuild.object.children.forEach(item => {
      item.name = item.name.replace('zuo', '')
      if (item.name === 'ding') {
        item.name = 6
      }
      item.name--
    })
    officeBuild.object.children.sort((a, b) => a.name - b.name).forEach(v => {
      v.name = 'zuo' + v.name
    })
    officeBuild.forEach(child => {
      if (child.isMesh) {
        child.frustumCulled = false // 关闭投射阴影
        child.material.emissive = child.material.color; // 设置材质颜色
        child.material.emissiveMap = child.material.map; // 设置材质贴图
        child.material.emissiveIntensity = 1.2 // 设置材质强度
        child.material.envmap = viewer.scene.background // 设置环境贴图
      }
    })
    oldOfficeBuild = officeBuild.object.clone()
    const buildBox = officeBuild.getBox()
    officeLabel = labelIns.addCss2dLabel({
      x: buildBox.max.x / 2,
      y: buildBox.max.y,
      z: buildBox.max.z
    }, `<span class="label">${model.object.name}</span>`)
    // 添加标签动画
    gsap.to(labelIns.label.position, {
      y: buildBox.max.y + 2,
      repeat: -1, // 循环播放
      yoyo: true, // 循环播放
      duration: 2, // 播放时间
      ease: "Bounce.inOut",
    })
  })
}
/**
 * 办公楼鼠标移动效果
 */
const officeMouseMove = () => {
  // TODO: 做一个节流
  viewer.startSelectEvent("mousemove", false, (model) => {
    if (curFloorName) {
      viewer.stopSelectEvent()
    }
    if (model.parent?.parent?.name === '办公大厅' && !isSplit) {
      officeFloorList.forEach((item) => {
        if (item === model.parent.name) {
          modelMoveName = item
          if (curFloorName === modelMoveName) {
            // 如果当前选中的楼层和鼠标移动选中的楼层相同，则不给当前选中的楼层改变材质，仍保持原来的材质
            return
          }
          officeBuild.object.getObjectByName(item).traverse((child) => {
            if (child.isMesh) {
              child.material = new THREE.MeshPhongMaterial({
                color: "yellow",
                transparent: true,
                opacity: 0.8,
                emissive: child.material.color, // 设置材质颜色
                emissiveMap: child.material.map, // 设置材质贴图
                emissiveIntensity: 3 // 设置材质强度
              })
            }
          })
        } else {
          if (!isSplit) {
            const oldModel = oldOfficeBuild.getObjectByName(item)
            officeBuild.object.getObjectByName(item)?.traverse((child) => {
              if (child.isMesh) {
                // 将未选中的楼层赋予之前的材质
                child.material = oldModel.getObjectByName(child.name).material
              }
            })
          } else {
            // 未选中的楼层设置为蓝色
            // officeBuild.object.getObjectByName(item).traverse((child) => {
            //   if (child.isMesh && child.parent.name !== curFloorName) {
            //     child.material = new THREE.MeshPhongMaterial({
            //       color: new THREE.Color('#123ca8'),
            //       transparent: true,
            //       opacity: 0.5,
            //       emissiveMap: child.material.map,
            //     })
            //   }
            // })
          }
        }
      })
    }
  })
}
/**
 * 办公楼点击
 */
const officeFloorClick = () => {
  viewer.renderer.domElement.addEventListener('click', (e) => {
    const rayCaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    mouse.x = (e.offsetX / viewer.renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -(e.offsetY / viewer.renderer.domElement.clientHeight) * 2 + 1
    // 通过摄像机和鼠标位置更新射线
    rayCaster.setFromCamera(mouse, viewer.camera)
    // TODO: 第一个参数是否需要指定模型
    const intersects = rayCaster.intersectObject(viewer.scene, true) // 计算物体和射线的焦点
    if (intersects.length > 0 && modelMoveName) {
      const model = intersects[0].object.parent
      if (model.name.includes("zuo")) {
        if (!isSplit) {
          // 隐藏车和标签
          // TODO: 找到更方便的模型指定方式，而不是每次都遍历查找
          carLabel.visible = false
          officeLabel.visible = false
          viewer.scene.children.find(item => item.name === "快递车").visible = false
          viewer.scene.children.find(o => o.name == 'cityv1').visible = false
          viewer.scene.children.find(o => o.name == '树').visible = false
          // 实验楼材质变化
          sceneList.forEach(item => {
            viewer.scene.children.find(o => o.name == item).traverse((child) => {
              child.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color('rgba(7,32,96,0.76)'),
                transparent: true,
                opacity: 0.1,
                wireframe: true,
                depthWrite: true, // 无法被选择，鼠标穿透
              })
            })
          })
          gsap.to(viewer.scene.children.find(o => o.name === "人").rotation, {
            y: Math.PI, // 旋转角度
            duration: 2,
            ease: "power1.inOut",
            onComplete: () => {
              isSplit = true
            },
          })
        }
        selectOffice(model)
      } else {
        if (!isSplit) {
          const oldModel = oldOfficeBuild.getObjectByName(modelMoveName)
          officeBuild.object.getObjectByName(modelMoveName).traverse(function (child) {
            if (child.isMesh) {
              child.material = oldModel.getObjectByName(child.name).material
            }
          })
        }
      }
    }
  })
}

const selectOffice = (model) => {
  curFloorName = model.name
  const oldModel = oldOfficeBuild.getObjectByName(curFloorName)
  // 找到当前点击的楼层
  const modelSelectIndex = officeFloorList.findIndex(item => item === curFloorName)
  if (modelSelectIndex === lastIndex) return
  if (!isSplit) {
    // 楼体还未分层的时候要做的事
    officeBuild.object.children.forEach((child, index) => {
      if (child.name === curFloorName) {
        // 当前楼层附着原本材质
        child.children.forEach(ol => {
          ol.material = oldModel.getObjectByName(ol.name).material
        })
      }
      // if (child.name === curFloorName) {
      //   // 当前楼层附着原本材质
      //   child.children.forEach(ol => {
      //     ol.material = oldModel.getObjectByName(ol.name).material
      //   })
      // } else {
      //   // 其余楼层附着蓝色透明材质
      //   child.children.forEach(Mesh => {
      //     Mesh.material = new THREE.MeshPhongMaterial({
      //       color: new THREE.Color('#123ca8'),
      //       transparent: true,
      //       opacity: 0.5,
      //       emissiveMap: Mesh.material.map,
      //     })
      //   })
      // }
      if (index > 0) {
        isSplit = true
        gsap.to(child.position, {
          y: child.position.y + index * 10,
          duration: 2,
          ease: "power1.inOut",
        })
      }

      // if (!model.userData.position && index > modelSelectIndex) {
      //   gsap.to(child.position, {
      //     y: !child.userData.position ? child.position.y + 25 : child.position.y,
      //     duration: 2,
      //     ease: "power1.inOut",
      //     onComplete: () => {
      //       child.userData.position = true
      //     },
      //   })
      // }
      // if (model.userData.position && index <= modelSelectIndex) {
      //   if (child.userData.position) {
      //     gsap.to(child.position, {
      //       y: oldOfficeBuild.getObjectByName(child.name).position.y,
      //       // z: child.position.z - 40,
      //       duration: 2,
      //       ease: "power1.inOut",
      //       onComplete: () => {
      //         child.userData.position = false
      //       },
      //     });
      //   }
      // }
    })
  } else {
    // TODO:点击快了之后会出现错乱；
    // 楼体分层之后点击抽出楼层
    officeBuild.object.children.forEach((child, index) => {
      if (index === lastIndex) {
        // 将上一次抽出的楼层归位
        gsap.to(child.position, {
          z: child.position.z + 40,
          duration: 2,
          ease: "power1.inOut",
        })
      }
      if (child.name === curFloorName) {
        gsap.to(child.position, {
          z: child.position.z - 40,
          duration: 2,
          ease: "power1.inOut",
          onComplete: () => {
            lastIndex = index

          }
        })
      }

    })
  }

  gsap.to(viewer.controls.target, {
    x: 12,
    y: 0,
    z: -5,
    duration: 2,
    ease: "power1.inOut",
    onComplete: () => {
    },
  });
  // gsap.to(viewer.camera.position, {
  //   x: 12,
  //   y: 18,
  //   z: 38,
  //   duration: 2,
  //   ease: "power1.inOut",
  //   onComplete: () => {
  //   },
  // });
}
/**
 * 加载实验楼
 */
const loadLaboratoryBuild = () => {
  modelLoader.loadModelToScene('/glTF/laboratoryBuild.gltf', model => {
    model.openCastShadow()
    model.openReceiveShadow()
    model.object.rotateY(Math.PI / 2)
    model.object.position.set(-17, 0, 5)
    model.object.scale.set(0.7, 0.7, 0.7)
    model.object.name = '实验楼'
    laboratoryBuild = model.object.clone()
    const bbox = model.getBox()
    labelIns.addCss2dLabel({
      x: bbox.max.x,
      y: bbox.max.y,
      z: bbox.max.z
    }, `<span class="label">${model.object.name}</span>`)

    // 添加标签动画
    gsap.to(labelIns.label.position, {
      y: bbox.max.y + 2,
      repeat: -1, // 循环播放
      yoyo: true, // 循环播放
      duration: 2, // 播放时间
      ease: "Bounce.inOut",
    })

  })
}
/**
 * 加载车辆
 */
const loadCar = () => {
  modelLoader.loadModelToScene('/glTF/car13.gltf', model => {
    car = model
    model.openCastShadow()
    model.openReceiveShadow()
    model.object.position.set(11.5, 0, 18)
    model.object.scale.set(1, 1, 1)
    model.object.name = '快递车'
    let boxx = model.getBox()
    // 加载车的标签
    carLabel = labelIns.addCss2dLabel({
      x: boxx.max.x,
      y: boxx.max.y + 2,
      z: boxx.max.z
    }, `<span class="label">${model.object.name}</span>`)
  })
}
/**
 * 加载树
 */
const loadTree = () => {
  modelLoader.loadModelToScene('glTF/tree_animate/new-scene.gltf', model => {
    model.openCastShadow()
    model.object.position.set(8, 0, 16)
    model.object.scale.set(0.08, 0.08, 0.08)
    model.object.name = '树'
    model.startAnimal()
  })
}

/**
 * 物体沿线移动方法
 */
const moveOnCurve = (model) => {
  if (curve && car) {
    if (progress <= 1 - velocity) {
      let carObj = model.object
      let boxx = model.getBox()
      carLabel.position.set(boxx.max.x, boxx.max.y + 2, boxx.max.z)
      if (carObj.position.z.toFixed(2) >= 28.00 && carObj.position.z.toFixed(2) <= 28.10) {
        if (isopen.value) {
          gsap.to(Mesh26.scale, {
            x: Mesh26.scale.x * 8,
            duration: 5,
            ease: "power1.inOut",
            onComplete: () => {
              isopen.value = false
            },
          })
        } else {
          gsap.to(Mesh26.scale, {
            x: Mesh26.scale.x / 8,
            duration: 5,
            ease: "power1.inOut",
            onComplete: () => {
              isopen.value = true
              viewer.addAnimate(timeen)
            },
            onStart: () => {
              viewer.removeAnimate(timeen)
            },
          });
        }
      }

      const point = curve.getPointAt(progress) // 获取样条曲线指定点坐标
      const pointBox = curve.getPointAt(progress + velocity) // 获取样条曲线指定点坐标

      if (point && pointBox) {
        carObj.position.set(point.x, point.y, point.z)
        //因为这个模型加载进来默认面部是正对Z轴负方向的，所以直接lookAt会导致出现倒着跑的现象，这里用重新设置朝向的方法来解决。
        carObj.lookAt(pointBox.x, pointBox.y, pointBox.z)
        if (isDriver.value) {
          viewer.camera.position.set(point.x, point.y + 2, point.z)
          viewer.camera.lookAt(pointBox.x, pointBox.y + 2, pointBox.z)
          // viewer.controls.position0.set(point.x, point.y + 2, point.z) //非必要，场景有控件时才加上
          //       viewer.controls.target.set(pointBox.x, pointBox.y + 2, pointBox.z) //非必要，场景有控件时才加上
        }

        const offsetAngle = 22 // 目标移动时的朝向偏移
        const mtx = new THREE.Matrix4() // 创建一个4维矩阵
        mtx.lookAt(carObj.position, pointBox, carObj.up) // 设置朝向
        mtx.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, offsetAngle, 0)))
        const toRot = new THREE.Quaternion().setFromRotationMatrix(mtx)  //计算出需要进行旋转的四元数值
        carObj.quaternion.slerp(toRot, 0.2)
      }
      progress += velocity;
    } else {
      progress = 0;
    }
  }
}
const makeCurve = () => {
  // 从一系列的点创建一条平滑的三维样条曲线
  curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(11.5, 0, 18),
    new THREE.Vector3(11.5, 0, 34),
    new THREE.Vector3(35, 0, 34),
    new THREE.Vector3(35, 0, 31),
    new THREE.Vector3(11.5, 0, 31),
  ])
  curve.curveType = "catmullrom" // 曲线类型
  curve.closed = true // 是否封闭曲线
  curve.tension = 0 // 设置线的张力，0为无弧度折线

  // 为曲线添加材质在场景中显示出来，不显示也不会影响运动轨迹，相当于一个Helper
  const points = curve.getPoints(0.1); // 获取曲线上的点
  const geometry = new THREE.BufferGeometry().setFromPoints(points); // 创建几何体
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 }); // 线材质
  const curveObject = new THREE.Line(geometry, material); // 线
  curveObject.position.y = -1;
  viewer.scene.add(curveObject)
}
const onReset = () => {
  gsap.to(viewer.camera.position, {
    x: 17,
    y: 10,
    z: 52,
    duration: 2,
    ease: "Bounce.inOut",
  });
  gsap.to(viewer.scene.children.find(o => o.name == '人').rotation, {
    y: 0,
    duration: 2,
    ease: "power1.inOut",
  });
  carLabel.visible = true
  officeLabel.visible = true
  viewer.scene.children.find(o => o.name === '快递车').visible = true
  viewer.scene.children.find(o => o.name === '树').visible = true
  viewer.scene.children.find(o => o.name === 'cityv1').visible = true
  viewer.scene.children[viewer.scene.children.findIndex(o => o.name == '实验楼')] = laboratoryBuild.clone()
  viewer.scene.children[viewer.scene.children.findIndex(o => o.name == '办公大厅')] = officeBuild.object = oldOfficeBuild.clone()
  curFloorName = ""
  modelMoveName = null
  isSplit = false
  lastIndex = null
  selectedFloorName = ""
  officeMouseMove()
}
</script>
<style lang='less' scoped>
#container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #f0f0f0;
  // position: relative;
}

#videoContainer {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 100;
  visibility: hidden;
}

.jindu-con {
  width: 300px;
  height: 10px;
  border-radius: 50px;
  background-color: white;
  margin-top: 10px;
  overflow: hidden;
}

#jindu {
  height: inherit;
  background-color: #007bff;
  width: 0;
}

#jindu-text-con {
  width: 300px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: 15%;
  text-align: center;
  background-color: rgba(255, 255, 255, .5);
  padding: 10px;
}

:deep(.label) {
  padding: 20px;
  background: #123ca8;
  color: aliceblue;
  border-radius: 5px;
  cursor: pointer;
}

.operate-box {
  position: absolute;
  z-index: 100;
  bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>