import Vector3 from './Vector3'
import Plane3 from './Plane3'
import Circle2 from './Circle2'
import Vector2 from './Vector2'

export default class Circle3 {

  plane: Plane3
  center: Vector3
  radius: number

  constructor(plane: Plane3, center: Vector3, radius: number) {
    this.plane = plane
    this.center = center
    this.radius = radius
  }

  contactsToVector3(p: Vector3): Vector3[] | undefined {
    const mayBeContacts = new Circle2(Vector2.zero(), this.radius).contactsToVector2(p.toVector2())
    if (mayBeContacts === undefined) {
      return undefined
    }
    return []
  }
}