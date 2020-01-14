import TileNumber from '../../tile/TileNumber'
import MMapStatus from './MMapStatus'
import MMap from '../MMap'


export default class MMapViewTiles {

  sheetMap: { [sheetIndex: number]: TileNumber[]}

  constructor() {
    this.sheetMap = {}
  }

  update(status: MMapStatus) {
    if (status.viewArea === undefined) {
      return
    }

    this.sheetMap = {}
    status.viewArea.points.forEach(point => {
      if (point.y <= MMap.MinY || point.y >= MMap.MaxY) {
        return
      }

      const tile = TileNumber.fromVector2(status.zoomAsInt, point.toVector2())
      const sheetIndex = Math.floor((point.x + 2) / 4)
      if (this.sheetMap[sheetIndex] === undefined) {
        this.sheetMap[sheetIndex] = []
      }
      if (this.sheetMap[sheetIndex].indexOf(tile) === -1) {
        this.sheetMap[sheetIndex].push(tile)
      }
    })
    console.log(this.sheetMap)
  }
}