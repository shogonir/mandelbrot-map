import Vector2 from "./Vector2"

export default class Vector3 {

  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z)
  }

  add(other: Vector3): Vector3 {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z)
  }

  subtract(other: Vector3): Vector3 {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z)
  }

  multiply(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar)
  }

  divide(scalar: number): Vector3 {
    return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar)
  }

  magnitude(): number {
    return Math.sqrt(this.squaredMagnitude())
  }

  squaredMagnitude(): number {
    return this.x ** 2 + this.y ** 2 + this.z ** 2
  }

  normalize(): Vector3 {
    return this.divide(this.magnitude())
  }

  isZero(): boolean {
    return this.x === 0 && this.y === 0 && this.z === 0
  }

  setX(x: number): Vector3 {
    return new Vector3(x, this.y, this.z)
  }

  setY(y: number): Vector3 {
    return new Vector3(this.x, y, this.z)
  }

  setZ(z: number): Vector3 {
    return new Vector3(this.x, this.y, z)
  }

  addX(x: number): Vector3 {
    return new Vector3(this.x + x, this.y, this.z)
  }

  addY(y: number): Vector3 {
    return new Vector3(this.x, this.y + y, this.z)
  }

  addZ(z: number): Vector3 {
    return new Vector3(this.x, this.y, this.z + z)
  }

  toVector2(): Vector2 {
    return new Vector2(this.x, this.y)
  }

  toArray(): number[] {
    return [ this.x, this.y, this.z ]
  }

  static zero(): Vector3 {
    return new Vector3(0, 0, 0)
  }

  static one(): Vector3 {
    return new Vector3(1, 1, 1)
  }
}