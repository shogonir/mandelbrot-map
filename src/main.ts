import MandelbrotSet from './mandelbrot/MandelbrotSet'
import TileNumber from './tile/TileNumber'
import MMap from './map/MMap'
import Vector2 from './common/Vector2'

(() => {
  const map = new MMap('map', new Vector2(0, 0), 0)

  const mayBeZoomPara = document.getElementById('zoom')
  if (mayBeZoomPara === null) {
    return
  }
  const zoomPara: HTMLElement = mayBeZoomPara

  map.onZoomChanged = (zoom: number) => {
    zoomPara.innerText = `zoom: ${zoom.toFixed(2)}`
  }

  const mayBeCenterPara = document.getElementById('center')
  if (mayBeCenterPara === null) {
    return
  }
  const centerPara: HTMLElement = mayBeCenterPara

  map.onCenterChanged = (center: Vector2) => {
    centerPara.innerText = `center: (${center.x.toFixed(4)}, ${center.y.toFixed(4)})`
  }
})()
