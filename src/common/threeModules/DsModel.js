import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'

export default class DsModel {
  constructor(model, viewer) {
    this.viewer = viewer
    this.model = model
    this.object = model.scene || model // 模型内部的模型对象，不晓得threejs里面要叫scene,跟场景的scene不是一个东西
    this.clock = new THREE.Clock()
    this.animalIndex = -1
  }
  /**
   * 获取模型大小和位置
   * @returns 
   */
  getBox() {
    this.object.updateMatrixWorld() // 更新模型的世界矩阵
    const box = new THREE.Box3().setFromObject(this.object) // 获取模型的包围盒
    return box
  }
  /**
   * 设置模型到原点位置
   */
  setCenter() {
    const box = this.getBox()
    const center = box.getCenter(new THREE.Vector3)
    this.object.position.x += this.object.position.x - center.x
    this.object.position.y += this.object.position.y - center.y
    this.object.position.z += this.object.position.z - center.z
  }
  /**
     * 设置模型比例
     * @param x 可以只填写一个参数
     * @param y 纵轴缩放
     * @param z 横轴缩放
     */
  setScale(x, y, z) {
    this.object.scale.set(x, y || x, z || x)
  }
  /**
   * 求模型的长宽高
   * @returns 
   */
  getLenth() {
    const box = this.getBox()
    return box.getSize(new THREE.Vector3())
  }
  /**
     * 设置模型缩放
     * @param x x横轴旋转
     * @param y 纵轴旋转
     * @param z z横轴旋转
     */
  setRotation(x, y, z) {
    if (x) this.object.rotation.x = x
    if (y) this.object.rotation.y = y
    if (z) this.object.rotation.z = z
  }
  /**
     * 设置模型位置
     * @param x x坐标
     * @param y y坐标
     * @param z z坐标
     * @param isRotation 是否根据传入坐标进行模型旋转
     */
  setPosition([x, y, z], isRotation = false) {
    if (isRotation) {
      const zValue = z - this.model.position.z
      const xValue = x - this.model.position.x
      const angle = Math.atan2(zValue, xValue)
      // TODO: 有问题
      this.object.rotation.y = this.rotationY - angle
    }
    this.object.position.set(x, y, z)
  }
  /**
     * 克隆模型
     * @param x
     * @param y
     * @param z
     * @returns {*}
     */
  cloneModel([x, y, z] = [0, 0, 0]) {
    const newScene = { ...this.model }
    const newModel = clone(this.object)
    newModel.position.set(x, y, z)
    this.viewer.scene.add(newModel)
    newScene.scene = newModel
    return new DsModel(newScene, this.viewer)
  }
  /**
   * 设置模型动画
   * @param {*} i 选择模型动画进行播放
   * @returns 
   */
  startAnimal(i = 0) {
    this.animalIndex = i
    if (!this.mixer) {
      this.mixer = new THREE.AnimationMixer(this.object) // 创建动画混合器
    }
    if (this.model.animations.length < 1) {
      return
    }
    this.mixer.clipAction(this.model.animations[i]).play() // 播放动画
    this.animalObject = {
      fun: this.#updateAnimal,
      content: this
    }
    this.viewer.addAnimate(this.animalObject) // 添加动画监听
  }
  /**
   * 停止动画
   * @returns 
   */
  stopAnimal() {
    if (this.model.animations.length < 1) return
    if (!this.mixer || !this.mixer.clipAction) return
    this.mixer.clipAction(this.model.animations[this.animaIndex]).stop()
    if (this.animaObject) this.viewer.removeAnimate(this.animaObject)
  }
  /**
   * 更新动画混合器
   * @param {*} e 
   */
  #updateAnimal(e) {
    e.mixer.update(e.clock.getDelta()) // 更新动画混合器
  }
  /**
     * 开启模型阴影 数组中移除阴影
     */
  openCastShadow(names = []) {
    this.model.scene.traverse(mesh => {
      if (mesh.type === 'Mesh' && names.indexOf(mesh.name) === -1) {
        mesh.frustumCulled = false // 不剔除
        mesh.material.side = THREE.DoubleSide // 双面显示
        mesh.castShadow = true // 阴影
        // mesh.material.emissive = mesh.material.color;
        // mesh.material.emissiveMap = mesh.material.map;
      }
    })
  }
  /**
     * 接收阴影
     * @param names 数组中的可以接收阴影
     */
  openReceiveShadow(names = []) {
    this.model.scene.traverse(mesh => {
      if (names.length === 0 || names.indexOf(mesh.name) !== -1) {
        mesh.receiveShadow = true
      }
    })
  }
  /**
     * 获取模型集合
     * @param callback 返回模型集合
     */
  forEach(callback) {
    const temp = []
    this.model.scene.traverse(mesh => {
      if (mesh.isMesh) {
        temp.push(mesh)
      }
    })
    // 避免数据冲突
    temp.forEach(item => {
      callback?.(item)
    })
  }
  /**
     * 关闭模型阴影
     */
  closeShadow() {
    this.model.scene.traverse(mesh => {
      mesh.castShadow = false
      mesh.receiveShadow = false
    })
  }
  /**
     * 设置模型炫酷 模式
     * @param option 颜色和透明度 颜色需要使用）0x 后面16进制颜色
     */
  setColorCool(color = 'rgb(255,255,255)', opacity = 0.05) {
    if (!this.isSaveMaterial) {
      this.materials = []
    }
    this.model.scene.traverse(model => {
      if (model.isMesh) {
        if (this.isSaveMaterial) {
          this.materials.push(model.material)
        }
        model.material = new THREE.MeshBasicMaterial({
          side: THREE.DoubleSide, // 双面显示
          transparent: true,
          depthWrite: true, // 渲染此材质是否对深度缓冲区有任何影响
          depthTest: false, //  是否在渲染此材质时启用深度测试
          color: new THREE.Color(color),
          opacity
        })
      }
    })
    this.isSaveMaterial = true
  }
}