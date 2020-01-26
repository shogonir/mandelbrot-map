import Vector2 from '../common/Vector2'
import MMap from '../map/MMap'
import Equalable from '../common/Equalable'

export default class TileNumber implements Equalable {

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

  equals(other: any): boolean {
    if (other instanceof Object) {
      return false
    }
    if (other instanceof TileNumber === false) {
      return false
    }

    const otherTile = other as TileNumber
    return this.x === otherTile.x && this.y === otherTile.y && this.z === otherTile.z
  }

  toString(): string {
    return `TileNumber(${this.x}, ${this.y}, ${this.z})`
  }

  static fromString(tileName: string): TileNumber | undefined {
    const pattern: RegExp = /^TileNumber\((\-?\d+), (\-?\d+), (\d+)\)$/
    if (pattern.test(tileName) === false) {
      return undefined
    }

    const mayBeMatch: RegExpMatchArray | null = pattern[Symbol.match](tileName)
    if (mayBeMatch === null || mayBeMatch.length < 3) {
      return undefined
    }
    const match: RegExpMatchArray = mayBeMatch

    try {
      const x = parseInt(match[1], 10)
      const y = parseInt(match[2], 10)
      const z = parseInt(match[3], 10)
      return TileNumber.createWithNoCheck(x, y, z)
    } catch(e) {
      return undefined
    }
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

  static fromVector2(z: number, vector: Vector2): TileNumber {
    const x = TileNumber.calculateX(z, vector.x)
    const y = TileNumber.calculateY(z, vector.y)
    return TileNumber.createWithNoCheck(x, y, z)
  }
}