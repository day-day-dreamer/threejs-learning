<!--
 * @Description: 加载3d模型
 * @Author: 笙痞77
 * @Date: 2023-05-05 10:20:56
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-05-05 15:47:40
-->
<template>
  <div id="three-dom" ref="screenDom"></div>
</template>
<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { onMounted, ref } from 'vue';

const screenDom = ref(null)
const scene = new THREE.Scene()

onMounted(() => {
  init()
})
const init = () => {
  // 透视摄像机
  const camera = new THREE.PerspectiveCamera(45, screenDom.value.clientWidth / screenDom.value.clientHeight, 0.25, 20)
  camera.position.set(- 1.8, 0.6, 2.7);

  new RGBELoader().setPath("/textures/").load("royal_esplanade_1k.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
    renderer.render(scene, camera)

    // model
    const loader = new GLTFLoader().setPath("/glTF/");
    loader.load("DamagedHelmet.gltf", (gltf) => {
      scene.add(gltf.scene)
      renderer.render(scene, camera)
    })
  })

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(screenDom.value.clientWidth, screenDom.value.clientHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  screenDom.value.appendChild(renderer.domElement)


  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", () => {
    renderer.render(scene, camera)
  })
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, - 0.2);
  controls.update();
}

</script>
<style lang="less" scoped>
#three-dom {
  width: 100%;
  height: 100%;
}
</style>