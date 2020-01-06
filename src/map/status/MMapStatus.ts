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
}