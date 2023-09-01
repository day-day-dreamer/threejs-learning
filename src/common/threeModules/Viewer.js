/*
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-08-28 16:43:52
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-08-31 13:55:51
 */
import { Cache, WebGLRenderer, PerspectiveCamera, Scene, Color } from "three"
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer" // 二维标签渲染器
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer" // 三维标签渲染器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import SkyBoxs from "./SkyBoxs"
import Lights from "./Lights"
import ThreeMouseEvent from "./ThreeMouseEvent"

export default class Viewer {
  /**
   * 
   * @param {*} id 场景容器id
   */
  constructor(id) {
    Cache.enabled = true // 开启缓存
    this.id = id
    this.renderer = undefined
    this.scene = undefined
    this.camera = undefined
    this.controls = undefined
    this.animateEventList = []
    this.#initViewer()

  }
  #initViewer() {
    this.#initRenderer()
    this.#initCamera()
    this.#initScene()
    this.#initControl()
    this.#initSkybox()
    this.#initLight()

    const animate = () => {
      requestAnimationFrame(animate)
      this.#updateDom()
      this.#renderDom()
      // 全局的公共动画函数，添加函数可同步执行
      this.animateEventList.forEach(
        event => {
          event.fun && event.content && event.fun(event.content)
        })
    }

    animate()
  }
  /**
   * 更新DOM
   */
  #updateDom() {
    this.controls.update();
    this.camera.aspect = this.viewerDom.clientWidth / this.viewerDom.clientHeight // 摄像机视锥体的长宽比，通常是使用画布的宽/画布的高
    this.camera.updateProjectionMatrix() // 更新摄像机投影矩阵 在任何参数被改变以后必须被调用,来使得这些改变生效
    this.renderer.setSize(this.viewerDom.clientWidth, this.viewerDom.clientHeight) // 设置渲染器的尺寸
    this.renderer.setPixelRatio(window.devicePixelRatio) // 设置渲染器的像素比
    this.labelRenderer.setSize(this.viewerDom.clientWidth, this.viewerDom.clientHeight) // 设置标签渲染器的尺寸
    this.css3DRenderer.setSize(this.viewerDom.clientWidth, this.viewerDom.clientHeight) // 设置标签渲染器的尺寸
  }
  #renderDom() {
    this.renderer.render(this.scene, this.camera) // 渲染场景
    this.labelRenderer.render(this.scene, this.camera) // 渲染2d标签场景
    this.css3DRenderer.render(this.css3dScene, this.camera) // 渲染3d标签场景
  }
  /**
   * 创建初始化场景界面
   */
  #initRenderer() {
    // 获取画布dom
    this.viewerDom = document.getElementById(this.id)
    // 初始化渲染器
    this.renderer = new WebGLRenderer({
      // logarithmicDepthBuffer: true, // true/false 表示是否使用对数深度缓冲，true性能不好
      antialias: true, // true/false表示是否开启反锯齿
      alpha: true, // true/false 表示是否可以设置背景色透明
      precision: "highp", // highp/mediump/lowp 表示着色精度选择
      premultipliedAlpha: true, // true/false 表示是否可以设置像素深度（用来度量图像的分辨率）
    })
    this.renderer.clearDepth(); // 设置深度缓冲区
    this.renderer.shadowMap.enabled = true // 场景中的阴影自动更新
    this.viewerDom.appendChild(this.renderer.domElement) // 将渲染器添加到画布中
    // 二维标签
    this.labelRenderer = new CSS2DRenderer() // 标签渲染器
    this.labelRenderer.domElement.style.zIndex = 2
    this.labelRenderer.domElement.style.position = 'absolute'
    this.labelRenderer.domElement.style.top = '0px'
    this.labelRenderer.domElement.style.left = '0px'
    this.labelRenderer.domElement.style.pointerEvents = 'none'// 避免HTML标签遮挡三维场景的鼠标事件
    this.viewerDom.appendChild(this.labelRenderer.domElement)

    // 三维标签
    this.css3DRenderer = new CSS3DRenderer() // 标签渲染器
    this.css3DRenderer.domElement.style.zIndex = 0
    this.css3DRenderer.domElement.style.position = 'absolute'
    this.css3DRenderer.domElement.style.top = '0px'
    this.css3DRenderer.domElement.style.left = '0px'
    this.css3DRenderer.domElement.style.pointerEvents = 'none'// 避免HTML标签遮挡三维场景的鼠标事件
    this.viewerDom.appendChild(this.css3DRenderer.domElement)
  }
  /**
   * 渲染相机
   */
  #initCamera() {
    this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500000) // 透视相机
    this.camera.position.set(50, 0, 50) // 相机位置
    this.camera.lookAt(0, 0, 0) // 设置相机方向
  }
  /**
   * 渲染场景
   */
  #initScene() {
    this.scene = new Scene()
    this.css3dScene = new Scene()
    this.scene.background = new Color('rgb(5,24,38)')
  }
  /**
   * 初始化控制
   */
  #initControl() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = false // 是否开启阻尼
    this.controls.screenSpacePanning = false // 定义当平移的时候摄像机的位置将如何移动, 摄像机将在与摄像机向上方向垂直的平面中平移
  }
  /**
   * 初始化天空盒
   */
  #initSkybox() {
    if (!this.skyboxs) {
      this.skyboxs = new SkyBoxs(this)
    }
    this.skyboxs.setSkybox()
  }
  /**
   * 初始化灯光
   */
  #initLight() {
    if (!this.lights) {
      this.lights = new Lights(this)
    }
  }
  /**
     * 添加全局的动画事件
     * @param animate 函数加参数对象
     * 传入对象 = {
            fun: 函数名称,
            content: 函数参数
        }
     */
  addAnimate(animate) {
    this.animateEventList.push(animate)
  }
  /**
    * 移除全局的动画事件
    * @param animate 函数加参数对象
    * 传入对象 = {
           fun: 函数名称,
           content: 函数参数
       }
    */
  removeAnimate(animate) {
    this.animateEventList.map((val, i) => {
      if (val === animate) this.animateEventList.splice(i, 1)
    })
  }
  /**
   * 开启鼠标事件
   * @param {*} mouseType 鼠标类型
   * @param {*} isSelect 是否选中
   * @param {*} callback 鼠标回调
   */
  startSelectEvent(mouseType, isSelect, callback) {
    if (!this.mouseEvent) {
      this.mouseEvent = new ThreeMouseEvent(this, isSelect, callback, mouseType)
    }
    this.mouseEvent.startSelect()
  }
  /**
   * 关闭鼠标事件
   */
  stopSelectEvent() {
    this.mouseEvent?.stopSelect()
  }
} 