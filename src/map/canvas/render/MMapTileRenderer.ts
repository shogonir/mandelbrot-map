import MMapTileRenderingWorker from 'worker-loader?name=static/[hash].worker.js!./worker/MMapTileRenderingWorker.worker'
import MMapStatus from '../../status/MMapStatus'
import ArrayList from '../../../common/ArrayList'
import TileNumber from '../../../tile/TileNumber'

export default class MMapTileRenderer {

  worker: MMapTileRenderingWorker
  workerIsBusy: boolean
  renderingTile: string

  tileCache: { [tileName: string]: ImageBitmap }

  mapUpdate: (() => void) | undefined

  constructor() {
    this.worker = new MMapTileRenderingWorker()
    this.worker.onmessage = (event: MessageEvent) => {
      if (event.data === undefined) {
        this.workerIsBusy = false
        return
      }
      const imageBitmap: ImageBitmap = event.data as ImageBitmap
      this.tileCache[this.renderingTile] = imageBitmap
      this.workerIsBusy = false

      if (this.mapUpdate !== undefined) {
        this.mapUpdate()
      }
    }

    this.workerIsBusy = false
    this.renderingTile = ''
    this.tileCache = {}
    this.mapUpdate = undefined
  }

  update(status: MMapStatus) {
    if (this.mapUpdate === undefined) {
      this.mapUpdate = status.mapUpdate
    }

    if (this.workerIsBusy) {
      return
    }

    const sheetMap: { [sheetIndex: number]: ArrayList<TileNumber> } = status.viewArea.viewTiles.sheetMap
    
    const tiles: TileNumber[] = []
    Object.values(sheetMap).forEach((tileNumberList: ArrayList<TileNumber>) => {
      tiles.push(...tileNumberList.toArray())
    })
    tiles.sort((t1: TileNumber, t2: TileNumber) => {
      return t1.center().subtract(status.center).magnitude() - t2.center().subtract(status.center).magnitude()
    })

    for (let tile of tiles.map(tile => tile.toChecked())) {
      const tileName: string = tile.toString()
      if (Object.keys(this.tileCache).includes(tileName)) {
        continue
      }
      this.renderingTile = tile.toString()
      this.workerIsBusy = true
      this.worker.postMessage(tile)
      break
    }
  }
}