<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-07-21 11:19:23
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-07-21 14:04:21
-->
<template>
  <div class="container" ref="container"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// 场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.z = 0.1;
// 渲染器
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

const container = ref()
onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, container.value)
  // 阻尼效果
  controls.enableDamping = true
  container.value.appendChild(renderer.domElement)
  render()
})

const render = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

// 添加立方体
// const geometry = new THREE.BoxGeometry(10, 10, 10);


// // 客厅图片
// const imgArr = ["4_l", "4_r", "4_u", "4_d", "4_b", "4_f",]
// let boxMaterials = []
// imgArr.forEach((item) => {
//   // 纹理加载
//   let texture = new THREE.TextureLoader().load(`/images/living/${item}.jpg`);

//   if (item === "4_u" || item === "4_d") {
//     // 上下两张图各绕中心旋转180度
//     texture.rotation = Math.PI;
//     texture.center = new THREE.Vector2(0.5, 0.5)
//   }
//   // 创建材质
//   boxMaterials.push(new THREE.MeshBasicMaterial({
//     map: texture
//   }))
// })

// const cube = new THREE.Mesh(geometry, boxMaterials)
// // 钻进立方体内部看，z= -1
// cube.geometry.scale(1, 1, -1)
// scene.add(cube)

// 添加球
const globeGeo = new THREE.SphereGeometry(5, 32, 32)
const loader = new RGBELoader();
loader.load("/textures/Living.hdr", (texture) => {
  const material = new THREE.MeshBasicMaterial({
    map: texture
  })
  const sphere = new THREE.Mesh(globeGeo, material)
  sphere.geometry.scale(1, 1, -1)
  scene.add(sphere)
})

</script>
<style lang='less' scoped>
.container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
</style>