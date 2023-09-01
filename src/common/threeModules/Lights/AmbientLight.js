import * as THREE from 'three'

/**
 * 灯光基类
 */
export default class AmbientLight {
  /**
   * 灯光基类
   */
  constructor (_viewer, option = { color: 'rgb(255,255,255)' }) {
    this.viewer = _viewer
    this.light = new THREE.AmbientLight(new THREE.Color(option.color)) // soft white light
    this.setOption(option)
    this.viewer.scene.add(this.light)
  }

  /**
   * 设置灯光参数
   * @param option
   */
  setOption (option = {}) {
    this.light.intensity = option.intensity || 1 // 光线强度
  }
}
