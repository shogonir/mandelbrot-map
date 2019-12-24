import Vector2 from "../../common/Vector2";

export default class MMapStatus {

  center: Vector2
  zoom: number

  constructor(center: Vector2, zoom: number) {
    this.center = center
    this.zoom = zoom
  }
}