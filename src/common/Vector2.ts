import Vector3 from './Vector3'

export default class Vector2 {

  x: number
  y: number
  
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y)
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar)
  }

  toVector3(): Vector3 {
    return new Vector3(this.x, this.y, 0)
  }

  static zero(): Vector2 {
    return new Vector2(0, 0)
  }
}