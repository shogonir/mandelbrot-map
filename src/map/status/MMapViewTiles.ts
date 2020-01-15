import TileNumber from '../../tile/TileNumber'
import MMapStatus from './MMapStatus'
import MMap from '../MMap'
import Vector3 from '../../common/Vector3'
import Numbers from '../../util/Numbers'
import Ray2 from '../../common/Ray2'

export default class MMapViewTiles {

  sheetMap: { [sheetIndex: number]: TileNumber[]}
  yMap: { [y: number]: TileNumber[] }

  constructor() {
    this.sheetMap = {}
    this.yMap = {}
  }

  update(status: MMapStatus) {
    if (status.viewArea === undefined) {
      return
    }
    const viewArea = status.viewArea

    this.sheetMap = {}
    this.yMap = {}
    this.listUpTilesOnLineSegment(status, viewArea.topLeft, viewArea.topRight)
    this.listUpTilesOnLineSegment(status, viewArea.topRight, viewArea.bottomRight)
    this.listUpTilesOnLineSegment(status, viewArea.bottomRight, viewArea.bottomLeft)
    this.listUpTilesOnLineSegment(status, viewArea.bottomLeft, viewArea.topLeft)
    this.listUpTilesFromFrame()
  }

  private listUpTilesOnLineSegment(status: MMapStatus, s: Vector3, t: Vector3) {
    const z = status.zoomAsInt
    const s2 = s.toVector2()
    const t2 = t.toVector2()

    this.addTileToYMap(TileNumber.fromVector2(z, s2))
    this.addTileToYMap(TileNumber.fromVector2(z, t2))

    const slope = (s2.x === t2.x) ? 2 : (t2.y - s2.y) / (t2.x - s2.x)
    if (Math.abs(slope) < 1) {
      const ray2 = (s2.x < t2.x) ? new Ray2(s2, t2.subtract(s2)) : new Ray2(t2, s2.subtract(t2))
      const minX = TileNumber.fromVector2(z, (s2.x < t2.x) ? s2 : t2).right()
      const maxX = TileNumber.fromVector2(z, (s2.x < t2.x) ? t2 : s2).left()
      const side = TileNumber.calculateSide(z)
      const half = side / 2
      Numbers.range(minX, maxX, side, true).forEach(x => {
        const y = ray2.intersectsWithLineXEqualsParameter(x).y
        const tileY = TileNumber.calculateY(z, y)
        const leftX = TileNumber.calculateX(z, x - half)
        const rightX = leftX + 1
        this.addTileToYMap(TileNumber.createWithNoCheck(leftX, tileY, z))
        this.addTileToYMap(TileNumber.createWithNoCheck(rightX, tileY, z))
      })
    } else {
      const ray2 = (s2.y < t2.y) ? new Ray2(s2, t2.subtract(s2)) : new Ray2(t2, s2.subtract(t2))
      const minY = TileNumber.fromVector2(z, (s2.y < t2.y) ? s2 : t2).top()
      const maxY = TileNumber.fromVector2(z, (s2.y < t2.y) ? t2 : s2).bottom()
      const side = TileNumber.calculateSide(z)
      const half = side / 2
      Numbers.range(minY, maxY, side, true).forEach(y => {
        const x = ray2.intersectsWithLineYEqualsParameter(y).x
        const tileX = TileNumber.calculateX(z, x)
        const bottomY = TileNumber.calculateY(z, y - half)
        const topY = bottomY + 1
        const maxY = TileNumber.maxXY(z)
        this.addTileToYMap(TileNumber.createWithNoCheck(tileX, bottomY, z))
        this.addTileToYMap(TileNumber.createWithNoCheck(tileX, topY, z))
      })
    }
  }

  private addTileToYMap(tile: TileNumber) {
    const maxY = TileNumber.maxXY(tile.z)
    if (tile.y < 0 || tile.y > maxY) {
      return
    }
    if (this.yMap[tile.y] === undefined) {
      this.yMap[tile.y] = []
    }
    this.yMap[tile.y].push(tile)
  }

  private listUpTilesFromFrame() {
    Object.keys(this.yMap).forEach(y => {
      const tiles: TileNumber[] = this.yMap[y]
      if (tiles.length === 0) {
        return
      }
      if (tiles.length === 1) {
        this.addTileToSheetMap(tiles[0])
        return
      }
      const xs = tiles.map(tile => tile.x)
      const minX = Math.min(...xs)
      const maxX = Math.max(...xs)
      const yy = tiles[0].y
      const z = tiles[0].z
      Numbers.range(minX, maxX, 1, true).forEach(x => {
        this.addTileToSheetMap(TileNumber.createWithNoCheck(x, yy, z))
      })
    })
  }

  private addTileToSheetMap(tile: TileNumber) {
    const x = tile.center().x
    const sheetIndex = Math.floor((x + 2) / 4)
    if (this.sheetMap[sheetIndex] === undefined) {
      this.sheetMap[sheetIndex] = []
    }
    this.sheetMap[sheetIndex].push(tile)
  }
}