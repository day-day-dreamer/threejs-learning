<!--
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-05-10 10:46:16
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-05-10 10:57:27
-->
<template>
  <div id="three-dom" ref="screenDom"></div>
</template>
<script setup>
import * as THREE from 'three'
import { onMounted, ref } from 'vue';

const screenDom = ref(null)
const scene = new THREE.Scene()


onMounted(() => {
  init()
})

const init = () => {
  // 透视摄像机
  const camera = new THREE.PerspectiveCamera(45, screenDom.value.clientWidth / screenDom.value.clientHeight, 0.1, 1000)
  camera.position.z = 5;
  // 创建渲染器
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(screenDom.value.clientWidth, screenDom.value.clientHeight)
  screenDom.value.appendChild(renderer.domElement)


  // 创建火焰纹理
  var fireTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png');

  // 创建火焰粒子系统
  var particleCount = 1800,
    particles = new THREE.BufferGeometry(),
    positions = new Float32Array(particleCount * 3),
    colors = new Float32Array(particleCount * 3),
    color = new THREE.Color();

  for (var i = 0; i < particleCount; i++) {
    var pX = Math.random() * 3 - 1.5,
      pY = Math.random() * 3 - 1.5,
      pZ = Math.random() * 3 - 1.5;

    positions[i * 3] = pX;
    positions[i * 3 + 1] = pY;
    positions[i * 3 + 2] = pZ;

    color.setHSL((pY + 1) / 2, 1.0, 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  var particleMaterial = new THREE.PointsMaterial({
    size: 0.2,
    map: fireTexture,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true
  });

  var particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  // 动画循环
  function animate() {
    requestAnimationFrame(animate);

    // 更新粒子位置
    for (var i = 0; i < particleCount; i++) {
      var positions = particleSystem.geometry.attributes.position.array;
      if (positions[i * 3 + 1] < -1.5) {
        positions[i * 3 + 1] = Math.random() * 3 + 1;
      } else {
        positions[i * 3 + 1] -= 0.01;
      }
    }

    // 重新渲染场景
    particleSystem.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate();

}




</script>
<style lang='less' scoped>
#three-dom {
  width: 100%;
  height: 100%;
}
</style>