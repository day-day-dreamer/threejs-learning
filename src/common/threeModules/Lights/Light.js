/**
 * 灯光基类
 */
export default class Light {
    /**
     * 灯光基类
     */
    constructor(_viewer) {
        this.viewer = _viewer
        this.light = {}
    }

    /**
     * 设置灯光位置
     * @param x
     * @param y
     * @param z
     */
    setPosition([x, y, z]) {
        if (this.light) this.light.position.set(x, y, z)
    }
}
