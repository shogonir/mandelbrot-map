import Vector3 from './Vector3'
import Ray3 from './Ray3'
import MathUtil from './MathUtil'
import Plane3 from './Plane3'
import Circle3 from './Circle3'

export default class Sphere3 {

  center: Vector3
  radius: number

  constructor(center: Vector3, radius: number) {
    this.center = center
    this.radius = radius
  }

  intersectsWithRay3(ray3: Ray3): Vector3[] | undefined {
    const c = this.center
    const s = ray3.start
    const d = ray3.direction
    const dx2 = d.x ** 2
    const dy2 = d.y ** 2
    const dz2 = d.z ** 2
    const aa = 1 + dy2 / dx2 + dz2 / dx2
    const bb = -2 * c.x - 2 * s.x * dy2 / dx2 - 2 * s.x * dz2 / dx2
      + 2 * (s.y - c.y) * d.y / d.x + 2 * (s.z - c.z) * d.z / d.x
    const cc = c.x ** 2 - this.radius ** 2
      s.x ** 2 * dz2 / dx2 + 2 * (c.y - s.y) * c.x * d.y / d.x + (s.y - c.y) ** 2
      s.x ** 2 * dz2 / dx2 + 2 * (c.z - s.z) * c.x * d.z / d.x + (s.z - c.z) ** 2
    
    const solutions: number[] = MathUtil.solveQuadraticEquation(aa, bb, cc)
    if (solutions.length <= 0) {
      return undefined
    }

    const intersections: Vector3[] = []
    for (let x of solutions) {
      const y = d.y * (x - s.x) / d.x + s.y
      const z = d.z * (x - s.x) / d.x + s.z
      intersections.push(new Vector3(x, y, z))
    }
    return intersections
  }

  intersectsWithPlane3(plane: Plane3): Circle3 | Vector3 | undefined {
    const ray1 = new Ray3(this.center.clone(), plane.normal.clone())
    const ray2 = new Ray3(this.center.clone(), plane.normal.multiply(-1))

    let intersection: Vector3
    let mayBeIntersection = ray1.intersectsWithPlane3(plane)
    if (mayBeIntersection !== undefined) {
      intersection = mayBeIntersection
    } else {
      mayBeIntersection = ray2.intersectsWithPlane3(plane)
      if (mayBeIntersection !== undefined) {
        intersection = mayBeIntersection
      } else {
        return undefined
      }
    }

    const distance = intersection.subtract(this.center).magnitude()
    if (distance > this.radius) {
      return undefined
    }
    if (distance === this.radius) {
      return intersection
    }
    const radius = Math.sqrt(this.radius ** 2 - distance ** 2)
    return new Circle3(plane.clone(), intersection, radius)
  }
}