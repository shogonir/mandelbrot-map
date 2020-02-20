import Vector3 from './Vector3'
import Plane3 from './Plane3'

export default class Ray3 {

  start: Vector3
  direction: Vector3

  constructor(start: Vector3, direction: Vector3) {
    this.start = start
    this.direction = direction
  }

  intersectsWithPlaneXEqualsParameter(x: number): Vector3 | undefined {
    if (this.start.x === x) {
      return this.start
    }

    if (this.direction.x === 0) {
      return undefined
    }

    if (this.start.x < x && this.direction.x < 0) {
      return undefined
    }

    if (this.start.x > x && this.direction.x > 0) {
      return undefined
    }

    const coefficient = (x - this.start.x) / this.direction.x
    return this.start.add(this.direction.multiply(coefficient))
  }

  intersectsWithPlaneYEqualsParameter(y: number): Vector3 | undefined {
    if (this.start.y === y) {
      return this.start
    }

    if (this.direction.y === 0) {
      return undefined
    }

    if (this.start.y < y && this.direction.y < 0) {
      return undefined
    }

    if (this.start.y > y && this.direction.y > 0) {
      return undefined
    }

    const coefficient = (y - this.start.y) / this.direction.y
    return this.start.add(this.direction.multiply(coefficient))
  }

  intersectsWithPlaneZEqualsParameter(z: number): Vector3 | undefined {
    if (this.start.z === z) {
      return this.start
    }

    if (this.direction.z === 0) {
      return undefined
    }

    if (this.start.z < z && this.direction.z < 0) {
      return undefined
    }

    if (this.start.z > z && this.direction.z > 0) {
      return undefined
    }

    const coefficient = (z - this.start.z) / this.direction.z
    return this.start.add(this.direction.multiply(coefficient))
  }

  intersectsWithPlane3(plane: Plane3): Vector3 | undefined {
    const p = plane.point
    const n = plane.normal
    const s = this.start
    const d = this.direction
    const t = n.x * (p.x - s.x) + n.y * (p.y - s.y) + n.z * (p.z - s.z)
      / (n.x * d.x + n.y * d.y + n.z * d.z)
    if (t < 0) {
      return undefined
    }
    return this.start.add(this.direction.multiply(t))
  }
}