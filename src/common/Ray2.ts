import Vector2 from './Vector2'
import Ray3 from './Ray3'

export default class Ray2 {

  start: Vector2
  direction: Vector2

  constructor(start: Vector2, direction: Vector2) {
    this.start = start.clone()
    this.direction = direction.clone()
  }

  intersectsWithLineXEqualsParameter(x: number): Vector2 | undefined {
    const ray3 = new Ray3(this.start.toVector3(), this.direction.toVector3())
    const result = ray3.intersectsWithPlaneXEqualsParameter(x)
    return result === undefined ? undefined : result.toVector2()
  }

  intersectsWithLineYEqualsParameter(y: number): Vector2 | undefined {
    const ray3 = new Ray3(this.start.toVector3(), this.direction.toVector3())
    const result = ray3.intersectsWithPlaneXEqualsParameter(y)
    return result === undefined ? undefined : result.toVector2()
  }
}