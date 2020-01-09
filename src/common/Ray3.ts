import Vector3 from './Vector3'

export default class Ray3 {

  start: Vector3
  direction: Vector3

  constructor(start: Vector3, direction: Vector3) {
    this.start = start
    this.direction = direction
  }

  intersectsWithPlaneZ0(): Vector3 | undefined {
    if (this.start.z === 0) {
      return this.start
    }

    if (this.direction.z === 0) {
      return undefined
    }

    if (this.start.z < 0 && this.direction.z < 0) {
      return undefined
    }

    if (this.start.z > 0 && this.direction.z > 0) {
      return undefined
    }

    const dToS = Math.abs(this.start.z / this.direction.z)
    return this.start.add(this.direction.multiply(dToS))
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
}