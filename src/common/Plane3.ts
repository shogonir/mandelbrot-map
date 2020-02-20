import Vector3 from './Vector3'

export default class Plane3 {

  point: Vector3
  normal: Vector3

  constructor(point: Vector3, normal: Vector3) {
    this.point = point
    this.normal = normal
  }

  clone(): Plane3 {
    return new Plane3(this.point.clone(), this.normal.clone())
  }
}