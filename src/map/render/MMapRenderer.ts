import MMapStatus from '../status/MMapStatus'
import CanvasUtils from '../../util/CanvasUtils'

export default class MMapRenderer {

  update(status: MMapStatus) {
    const ppu = CanvasUtils.calculatePixelPerUnit(status.zoom)
    const halfWidth = status.clientWidth / 2
    const halfHeight = status.clientHeight / 2
    const minX = status.center.x - (halfWidth * ppu)
    const maxX = status.center.x + (halfWidth * ppu)
    const minY = status.center.y - (halfHeight * ppu)
    const maxY = status.center.y + (halfHeight * ppu)
    console.log('viewport')
    console.log(minX, maxX)
    console.log(minY, maxY)
    console.log('')
  }
}