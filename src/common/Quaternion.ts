import Vector3 from './Vector3'

export default class Quaternion {

  a: number
  b: number
  c: number
  d: number

  constructor(a: number, b: number, c: number, d: number) {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
  }

  add(other: Quaternion): Quaternion {
    return new Quaternion(
      this.a + other.a,
      this.b + other.b,
      this.c + other.c,
      this.d + other.d
    )
  }

  scalarTimes(scalar: number): Quaternion {
    return new Quaternion(this.a * scalar, this.b * scalar, this.c * scalar, this.d * scalar)
  }

  multiply(other: Quaternion): Quaternion {
    return new Quaternion(
      this.a * other.a - this.b * other.b - this.c * other.c - this.d * other.d,
      this.a * other.b + this.b * other.a + this.c * other.d - this.d * other.c,
      this.a * other.c - this.b * other.d + this.c * other.a + this.d * other.b,
      this.a * other.d + this.b * other.c - this.c * other.b + this.d * other.a
    )
  }

  norm(): number {
    return Math.sqrt(this.squaredNorm())
  }

  squaredNorm(): number {
    return this.a ** 2 + this.b ** 2 + this.c ** 2 + this.d ** 2
  }

  conjugate(): Quaternion {
    return new Quaternion(this.a, -this.b, -this.c, -this.d)
  }

  inverse(): Quaternion {
    return this.conjugate().scalarTimes(1 / this.squaredNorm())
  }

  static fromRadianAndVector3(radian: number, vector: Vector3): Quaternion | undefined {
    if (vector.isZero()) {
      return undefined
    }

    const normalized = vector.normalize()
    const halfRadian = radian / 2
    const sinHalfRadian = Math.sin(halfRadian)
    return new Quaternion(
      Math.cos(halfRadian),
      normalized.x * sinHalfRadian,
      normalized.y * sinHalfRadian,
      normalized.z * sinHalfRadian
    )
  }
}