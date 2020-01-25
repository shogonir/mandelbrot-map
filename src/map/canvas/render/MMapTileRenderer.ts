import MMapTileRenderingWorker from 'worker-loader?name=static/[hash].worker.js!./worker/MMapTileRenderingWorker.worker'
import MMapStatus from '../../status/MMapStatus'
import ArrayList from '../../../common/ArrayList'
import TileNumber from '../../../tile/TileNumber'

export default class MMapTileRenderer {

  worker: MMapTileRenderingWorker
  workerIsBusy: boolean
  renderingTile: string

  tileCache: { [tileName: string]: ImageBitmap }

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
      // console.log(this.tileCache)
    }

    this.workerIsBusy = false
    this.renderingTile = ''
    this.tileCache = {}
  }

  update(status: MMapStatus) {
    if (this.workerIsBusy) {
      return
    }

    const sheetMap: { [sheetIndex: number]: ArrayList<TileNumber> } = status.viewArea.viewTiles.sheetMap
    const mayBeTiles: ArrayList<TileNumber> | undefined = sheetMap[0]
    if (mayBeTiles === undefined) {
      return
    }
    const tiles: ArrayList<TileNumber> = mayBeTiles

    for (let tile of tiles) {
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