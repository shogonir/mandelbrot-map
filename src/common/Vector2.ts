import Vector3 from './Vector3'

export default class Vector2 {

  x: number
  y: number
  
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y)
  }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y)
  }

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y)
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar)
  }

  rotate(theta: number): Vector2 {
    const x = this.x * Math.cos(theta) - this.y * Math.sin(theta)
    const y = this.x * Math.sin(theta) + this.y * Math.cos(theta)
    return new Vector2(x, y)
  }

  toVector3(): Vector3 {
    return new Vector3(this.x, this.y, 0)
  }

  toVector3WithZ(z: number): Vector3 {
    return new Vector3(this.x, this.y, z)
  }

  static zero(): Vector2 {
    return new Vector2(0, 0)
  }
}