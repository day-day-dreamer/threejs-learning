import * as THREE from 'three'

/**
 * 灯光基类
 */
export default class RectAreaLight {
  /**
   * 灯光基类
   */
  constructor (_viewer, position = [0, 40, 0], option = { color: 'rgb(255,255,255)' }) {
    this.viewer = _viewer
    const color = new THREE.Color(option.color)
    // 创建区域光 颜色ffffff,强度：5，宽：2，高：6
    this.light = new THREE.RectAreaLight(color, option.intensity || 20, option.width || 10, option.height || 10)
    this.geometry = new THREE.PlaneGeometry(option.width || 10, option.height || 10)
    this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: color
    }))
    this.light.add(this.mesh)
    this.light.rotation.x = Math.PI // 绕轴旋转
    this.viewer.scene.add(this.light)
    this.setPosition(position)
  }

  /**
   * 设置灯光参数
   * @param option
   */
  setOption (option = {}) {
    this.light.intensity = option.intensity || 20 // 光线强度
    this.light.ambient = option.ambient || 1 // 光线强度
    this.light.width = option.width || 10 // 光的衰减指数
    this.light.height = option.height || 10 // 光的衰减指数
  }

  /**
   * 设置灯光位置
   * @param x
   * @param y
   * @param z
   */
  setPosition ([x, y, z]) {
    if (this.light) this.light.position.set(x || 0, y || 0, z || 0)
  }
}
