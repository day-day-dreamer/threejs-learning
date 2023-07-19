<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-05-05 10:20:56
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-05-06 16:13:28
-->
<template>
  <div id="three-dom" ref="screenDom"></div>
</template>
<script setup>
import * as THREE from 'three'
import { onMounted, ref } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const screenDom = ref(null)
const scene = new THREE.Scene()

onMounted(() => {
  init()
})


const init = () => {
  // 透视摄像机
  const camera = new THREE.PerspectiveCamera(75, screenDom.value.clientWidth / screenDom.value.clientHeight, 0.1, 100)


  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 反锯齿
  })
  renderer.setSize(screenDom.value.clientWidth, screenDom.value.clientHeight)
  screenDom.value.appendChild(renderer.domElement)
  // 鼠标控制
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 0)
  controls.update()

  // 光线
  const light = new THREE.DirectionalLight(0xFFFFFF, 1)
  light.position.set(-1, 2, 4);
  scene.add(light);

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshPhongMaterial({
    color: "9f9",
  })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  camera.position.z = 5

  // 天空盒材质
  const loader = new THREE.TextureLoader()
  const texture = loader.load("/images/panorama.jpg", () => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
  })



  const animate = () => {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera)
  }
  animate()
}

</script>
<style lang="less" scoped>
#three-dom {
  width: 100%;
  height: 100%;

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>