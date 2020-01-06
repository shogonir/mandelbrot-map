import Vector2 from "../../common/Vector2";
import CanvasUtils from "../../util/CanvasUtils";

export default class MMapStatus {

  center: Vector2
  zoom: number

  clientWidth: number
  clientHeight: number

  minUnit: Vector2
  maxUnit: Vector2

  constructor(center: Vector2, zoom: number, clientWidth: number, clientHeight: number) {
    this.center = center
    this.zoom = zoom
    this.clientWidth = clientWidth
    this.clientHeight = clientHeight
  }

  update() {
    const ptu = CanvasUtils.calculatePixelToUnit(this.zoom)
    const halfWidth = this.clientWidth / 2
    const halfHeight = this.clientHeight / 2
    this.minUnit = new Vector2(this.center.x - (halfWidth * ptu), this.center.y - (halfHeight * ptu))
    this.maxUnit = new Vector2(this.center.x + (halfWidth * ptu), this.center.y + (halfHeight * ptu))
  }

  mappingX(x: number): number {
    return x - this.center.x
  }

  mappingY(y: number): number {
    return y - this.center.y
  }

  mappingVector2(v: Vector2): Vector2 {
    return new Vector2(this.mappingX(v.x), this.mappingY(v.y))
  }
}