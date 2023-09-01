/*
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-08-31 11:20:09
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-08-31 16:18:55
 */
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

export default class ThreeMouseEvent {
  constructor(viewer, isSelect, callback, type = 'click') {
    this.viewer = viewer
    this.isSelect = isSelect
    this.callback = callback
    this.type = type
    this.composer = new EffectComposer(this.viewer.renderer)
    return this
  }
  startSelect() {
    this.stopSelect()
    this.bingEvent = this.#event.bind(this, this)
    this.viewer.renderer.domElement.addEventListener(this.type, this.bingEvent)
  }
  stopSelect() {
    this.viewer.renderer.domElement.removeEventListener(this.type, this.bingEvent)
  }
  #event(that, event) {
    const raycaster = new THREE.Raycaster() // 创建射线
    const mouse = new THREE.Vector2() // 创建鼠标坐标
    mouse.x = (event.offsetX / that.viewer.renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -(event.offsetY / that.viewer.renderer.domElement.clientHeight) * 2 + 1
    raycaster.setFromCamera(mouse, that.viewer.camera) // 设置射线的起点和终点
    // TODO: 第一个参数是否需要外部传入，减小监听范围
    const intersects = raycaster.intersectObject(that.viewer.scene, true) // 检测射线与模型是否相交
    if (intersects.length > 0 && intersects[0]) {
      that.callback(intersects[0].object, intersects[0].point)
    }
  }
}