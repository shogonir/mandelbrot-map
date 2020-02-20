import Vector3 from './Vector3'
import Plane3 from './Plane3'

export default class Circle3 {

  plane: Plane3
  center: Vector3
  radius: number

  constructor(plane: Plane3, center: Vector3, radius: number) {
    this.plane = plane
    this.center = center
    this.radius = radius
  }
}