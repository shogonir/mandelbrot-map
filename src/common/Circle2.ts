import Vector2 from './Vector2'
import MathUtil from './MathUtil'

export default class Circle2 {

  center: Vector2
  radius: number

  constructor(center: Vector2, radius: number) {
    this.center = center
    this.radius = radius
  }

  contactsToVector2(p: Vector2): Vector2[] | undefined {
    const c = this.center
    const r = this.radius

    const a = - ((p.y - c.y) ** 2) - ((p.x - c.x) ** 2)
    const b = 2 * c.x * ((p.y - c.y) ** 2 + (p.x - c.x) ** 2) + 2 * r ** 2 * (p.x - c.x)
    const cc = (p.y - c.y) ** 2 * (r ** 2 - c.x ** 2) - r ** 4 + c.x ** 2 * (p.x - c.x) ** 2 - 2 * r ** 2 * c.x * (p.x - c.x)
    const mayBeXs: number[] | undefined = MathUtil.solveQuadraticEquation(a, b, cc)
    
    if (mayBeXs === undefined) {
      return undefined
    }
    const xs: number[] = mayBeXs
    
    const contacts: Vector2[] = []
    for (const x of xs) {
      const y = c.y + r ** 2 / ((p.x - c.x) * (p.x - c.x) * (p.y - c.y))
      contacts.push(new Vector2(x, y))
    }
    return contacts
  }
}