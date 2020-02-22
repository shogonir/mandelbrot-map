import Vector2 from './Vector2'

export default class Circle2 {

  center: Vector2
  radius: number

  constructor(center: Vector2, radius: number) {
    this.center = center
    this.radius = radius
  }
}