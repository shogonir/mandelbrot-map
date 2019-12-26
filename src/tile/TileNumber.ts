import Vector2 from '../common/Vector2'

export default class TileNumber {

  x: number
  y: number
  z: number

  side: number
  half: number
  centerCoord: Vector2

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z

    this.half = 2 ** (-z + 1)
    this.side = this.half * 2
    this.centerCoord = new Vector2(x * this.side, y * this.side)
  }

  center(): Vector2 {
    return this.centerCoord
  }

  left(): number {
    return this.centerCoord.x - this.half
  }

  right(): number {
    return this.centerCoord.x + this.half
  }

  bottom(): number {
    return this.centerCoord.y - this.half
  }

  top(): number {
    return this.centerCoord.y + this.half
  }
}