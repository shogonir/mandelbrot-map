import { mat4, vec3 } from 'gl-matrix'

import Vector3 from './Vector3'
import EngineMath from '../engine/common/EngineMath'

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

  product(v: Vector3): Vector3 {
    const mat: mat4 = this.toMat4()
    const vec: vec3 = vec3.fromValues(v.x, v.y, v.z)
    vec3.transformMat4(vec, vec, mat)
    return new Vector3(vec[0], vec[1], vec[2])
  }

  rotateX(radian: number): Quaternion {
    return this.multiply(Quaternion.fromRadianAndAxis(radian, new Vector3(1, 0, 0)))
  }

  rotateY(radian: number): Quaternion {
    return this.multiply(Quaternion.fromRadianAndAxis(radian, new Vector3(0, 1, 0)))
  }

  rotateZ(radian: number): Quaternion {
    return this.multiply(Quaternion.fromRadianAndAxis(radian, new Vector3(0, 0, 1)))
  }

  toMat4(): mat4 {
    const matrix = mat4.create()
    const s = 2 / this.norm()
    const a = this.a
    const b = this.b
    const c = this.c
    const d = this.d
    mat4.set(
      matrix, 
      1 - s * (c**2 + d**2) , s * (b * c - a * d)   , s * (b * d + a * c)   , 0,
      s * (b * c + d * a)   , 1 - s * (b**2 + d**2) , s * (c * d - a * b)   , 0,
      s * (b * d - a * c)   , s * (c * d + a * b)   , 1 - s * (b**2 + c**2) , 0,
      0                     , 0                     , 0                     , 1
    )
    return matrix
  }

  static fromRadianAndAxis(radian: number, vector: Vector3): Quaternion {
    if (vector.isZero()) {
      return new Quaternion(0, 0, 0, 1)
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