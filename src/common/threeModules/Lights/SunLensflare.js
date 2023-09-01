import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js'
import * as THREE from 'three'

export default class SunLensflare {
  /**
     * 太阳炫光
     * @param _viewer 视图
     */
  constructor (_viewer) {
    this.scene = _viewer.scene
    // lensflares
    const textureLoader = new THREE.TextureLoader()
    this.textureFlare0 = textureLoader.load('resources/lensflare/lensflare0.png')
    this.textureFlare3 = textureLoader.load('resources/lensflare/lensflare3.png')
  }

  /**
     * 添加炫光
     * @param x
     * @param y
     * @param z
     */
  addToScene (x = 200, y = 200, z = 200) {
    this.light = new THREE.PointLight(0xffffff, 0, 0)
    this.light.color.setHSL(0.995, 0.5, 0.9)
    this.light.position.set(x, y, z)
    this.scene.add(this.light)

    // 构建炫光
    const lensflare = new Lensflare()
    lensflare.addElement(new LensflareElement(this.textureFlare0, 700, 0, this.light.color))
    lensflare.addElement(new LensflareElement(this.textureFlare3, 60, 0.6))
    lensflare.addElement(new LensflareElement(this.textureFlare3, 70, 0.7))
    lensflare.addElement(new LensflareElement(this.textureFlare3, 120, 0.9))
    lensflare.addElement(new LensflareElement(this.textureFlare3, 70, 1))
    this.light.add(lensflare)
  }

  /**
   * 设置炫光位置角度
   * @param x
   * @param y
   * @param z
   */
  setPosition (x = 200, y = 200, z = 200) {
    if (this.light) this.light.position.set()
  }
}
