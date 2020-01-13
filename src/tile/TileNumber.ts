import Vector2 from '../common/Vector2'
import MMap from '../map/MMap'

/**
 * if z equals 0, tile (x, y, z) = (0, 0, 0) represents whole area (-2 <= x, y < 2)
 * bottom left origin
 */
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

    this.half = TileNumber.calculateHalf(z)
    this.side = TileNumber.calculateSide(z)
    this.centerCoord = new Vector2(
      MMap.MinX + x * this.side + this.half,
      MMap.MinY + y * this.side + this.half
    )
  }

  static create(x: number, y: number, z: number): TileNumber | undefined {
    if (z < 0) {
      return undefined
    }

    const maxXY = TileNumber.calculateMaxXY(z)
    if (x < 0 || x > maxXY) {
      return undefined
    }
    if (y < 0 || y > maxXY) {
      return undefined
    }

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

  static calculateMaxXY(z: number): number {
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
    return new TileNumber(x, y, z)
  }
}