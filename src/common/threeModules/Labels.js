/*
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-08-30 14:03:47
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-08-30 15:25:31
 */
import { InteractiveGroup } from "three/examples/jsm/interactive/InteractiveGroup"
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

export default class Labels {
  constructor(viewer) {
    this.viewer = viewer
    this.group = new InteractiveGroup(this.viewer.renderer, this.viewer.camera) // 创建交互对象
    this.viewer.scene.add(this.group)
  }
  /**
   * 添加2d标签
   * @param {*} position 
   * @param {*} html html内容
   */
  addCss2dLabel(position = { x: 0, y: 0, z: 0 }, html = "") {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.innerHTML = html
    this.label = new CSS2DObject(div)
    this.label.position.set(position.x, position.y, position.z)
    this.viewer.scene.add(this.label)
    return this.label
  }
}