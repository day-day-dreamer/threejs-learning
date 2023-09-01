/*
 * @Description: 
 * @Author: 笙痞77
 * @Date: 2023-08-29 09:59:49
 * @LastEditors: 笙痞77
 * @LastEditTime: 2023-08-31 11:00:33
 */
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import DsModel from './DsModel'

/**
 * 模型加载类（只能加载GLTF及GLB格式）
 */
export default class ModelLoader {
  constructor(viewer) {
    this.viewer = viewer
    this.scene = viewer.scene
    this.loaderGLTF = new GLTFLoader() // 加载gltf模型
    this.loaderFBX = new FBXLoader() // 加载fbx模型
    this.dracoLoader = new DRACOLoader() // 加载draco模型(加载基于Google Draco压缩格式的3D模型的类)
    this.dracoLoader.setDecoderPath('/js/draco/') // 设置draco模型解码器路径
    this.loaderGLTF.setDRACOLoader(this.dracoLoader) // 设置draco模型加载器
  }
  /**
      * 添加模型数据
      * @param url 模型的路径
      * @param callback 返回模型对象，常用一些功能挂接在模型对象上
      * @param progress 返回加载进度，还有问题，需要修改
      */
  loadModelToScene(url, callback, progress) {
    this.loadModel(url, model => {
      this.scene.add(model.object) // 加载模型
      callback?.(model)
    }, num => {
      progress?.(num) // 加载进度
    })
  }
  /**
    * 加载模型
    * @param url 模型路径
    * @param callback 回调模型
    * @param progress 返回加载进度
    */
  loadModel(url, callback, progress) {
    let loader = this.loaderGLTF
    if (url.indexOf('.fbx') !== -1) {
      loader = this.loaderFBX
    }
    loader.load(url, model => {
      callback?.(new DsModel(model, this.viewer))
    }, xhr => {
      progress?.((xhr.loaded / xhr.total).toFixed(2))
    }, (error) => {
      console.error('模型渲染报错：', error)
    })
  }
}