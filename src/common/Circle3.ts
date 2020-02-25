import Vector3 from './Vector3'
import Plane3 from './Plane3'
import Circle2 from './Circle2'
import Vector2 from './Vector2'
import Quaternion from './Quaternion'

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
    const n = this.plane.normal
    const xRadian = Math.atan2(-n.z, n.y)
    const movedN: Vector3 = Quaternion.zero().rotateX(xRadian).product(n)
    const yRadian = Math.atan2(-movedN.z, movedN.x)
    const movedP = Quaternion.zero().rotateX(xRadian).rotateY(yRadian).product(p.subtract(this.center))
    
    const mayBeContacts2: Vector2[] | undefined = new Circle2(Vector2.zero(), this.radius).contactsToVector2(movedP.toVector2())
    if (mayBeContacts2 === undefined) {
      return undefined
    }

    const contacts2: Vector2[] | undefined = mayBeContacts2
    return contacts2.map((v2: Vector2) => v2.toVector3())
  }
}