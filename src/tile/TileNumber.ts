import Vector2 from '../common/Vector2'
import MMap from '../map/MMap'

export default class TileNumber {

  x: number
  y: number
  z: number

  side: number
  half: number
  centerCoord: Vector2

  private constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z

    this.half = 2 ** (-z + 1)
    this.side = this.half * 2
    this.centerCoord = new Vector2(
      MMap.MinX + x * this.side + this.half,
      MMap.MinY + y * this.side + this.half
    )
  }

  static create(x: number, y: number, z: number): TileNumber | undefined {
    if (z < 0) {
      return undefined
    }

    const numberTilesInSide = 2 ** z
    if (x < 0 || x >= numberTilesInSide) {
      return undefined
    }
    if (y < 0 || y >= numberTilesInSide) {
      return undefined
    }

    return new TileNumber(x, y, z)
  }

  static createWithNoCheck(x: number, y: number, z: number): TileNumber {
    return new TileNumber(x, y, z)
  }

  center(): Vector2 {
    return this.centerCoord.clone()
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

  static calculateHalf(z: number): number {
    return 2 ** (-z + 1)
  }

  static calculateSide(z: number): number {
    return TileNumber.calculateHalf(z) * 2
  }

  static maxXY(z: number): number {
    return 2 ** z - 1
  }

  static calculateX(z: number, xValue: number): number {
    const side = TileNumber.calculateSide(z)
    return Math.floor((xValue - MMap.MinX) / side)
  }

  static calculateY(z: number, yValue: number): number {
    const side = TileNumber.calculateSide(z)
    return Math.floor((yValue - MMap.MinY) / side)
  }

  static fromVector2(z: number, vector: Vector2): TileNumber | undefined {
    const x = TileNumber.calculateX(z, vector.x)
    const y = TileNumber.calculateY(z, vector.y)
    return TileNumber.createWithNoCheck(x, y, z)
  }
}