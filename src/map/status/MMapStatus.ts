import Vector2 from "../../common/Vector2";

export default class MMapStatus {

  center: Vector2
  zoom: number

  clientWidth: number
  clientHeight: number

  constructor(center: Vector2, zoom: number) {
    this.center = center
    this.zoom = zoom
    this.clientWidth = 0
    this.clientHeight = 0
  }
}