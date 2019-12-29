export default class Vector2 {

  x: number
  y: number
  
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y)
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar)
  }
}