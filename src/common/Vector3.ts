export default class Vector3 {

  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
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
}