/*
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-08-28 18:46:05
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-09-04 17:25:28
 */
import * as THREE from 'three'

/**
 * 灯光基类
 */
export default class AmbientLight {
  /**
   * 灯光基类
   */
  constructor(_viewer, option = { color: 'rgb(255,255,255)' }) {
    this.viewer = _viewer
    this.light = new THREE.AmbientLight(0x404040) // soft white light
    this.setOption(option)
    this.viewer.scene.add(this.light)
  }

  /**
   * 设置灯光参数
   * @param option
   */
  setOption(option = {}) {
    this.light.intensity = option.intensity || 1 // 光线强度
  }
}
