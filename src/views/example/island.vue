<!--
 * @Description: 三亚小岛
 * @Author: 笙痞77
 * @Date: 2023-07-21 14:04:02
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-07-21 16:20:36
-->
<template>
  <div class="container" ref="container"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Water } from "three/examples/jsm/objects/Water2"
// 模型解压
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';


// 场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
// 设置相机位置
camera.position.set(-50, 50, 130);
// 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight
// 更新摄像头投影矩阵
camera.updateProjectionMatrix();
scene.add(camera)
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
  logarithmicDepthBuffer: true, // 对数深度缓存
})
// 环境编码
// renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight)

const render = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
const container = ref()
onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, container.value)
  // 阻尼效果
  controls.enableDamping = true
  createVideo()
  container.value.appendChild(renderer.domElement)
  render()
})

// 添加平面
// const planeGeo = new THREE.PlaneGeometry(100, 100);
// const planeMaterial = new THREE.MeshBasicMaterial({
//   color: 0xffffff
// })
// const plane = new THREE.Mesh(planeGeo, planeMaterial)
// scene.add(plane)

// 创建天空球体
const skyGeo = new THREE.SphereGeometry(1000, 60, 60);
const skyTex = new THREE.TextureLoader().load("/images/sky.jpg")
const skyMat = new THREE.MeshBasicMaterial({
  map: skyTex
})
// 视角进入球体内部
skyGeo.scale(1, 1, -1)
const sky = new THREE.Mesh(skyGeo, skyMat)
scene.add(sky)


// 视频纹理
const createVideo = () => {
  const video = document.createElement("video");
  video.src = "/video/sky.mp4"
  video.loop = true
  window.addEventListener("click", (e) => {
    if (video.paused) {
      video.play();
      const texture = new THREE.VideoTexture(video)
      skyMat.map = texture
      skyMat.map.needsUpdate = true;
    }
  })

}

// 载入环境纹理
const hdrLoader = new RGBELoader()
hdrLoader.loadAsync("/hdr/050.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture
  scene.environment = texture
})

// 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-100, 100, 10)
scene.add(light)

// 创建水面
const waterGeo = new THREE.CircleGeometry(300, 64)
const waterTexLoader = new THREE.TextureLoader()
const waterMat = new Water(waterGeo, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 2,
  normalMap0: waterTexLoader.load("/images/Water_1_M_Normal.jpg"),
  normalMap1: waterTexLoader.load("/images/Water_2_M_Normal.jpg"),
})
// 水平面抬高3米淹没石头
waterMat.position.y = 3;
// 水面旋转至水平
waterMat.rotation.x = -Math.PI / 2;
scene.add(waterMat)

// 添加小岛模型
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
// 添加draco载入库
dracoLoader.setDecoderPath("/js/draco/")
loader.setDRACOLoader(dracoLoader)

loader.load("/glb/island2.glb", (gltf) => {
  const isLand = gltf.scene
  // isLand.position.y = -50;
  scene.add(isLand)
})
</script>
<style lang='less' scoped>
.container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
</style>