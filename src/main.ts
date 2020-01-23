import MandelbrotSet from './mandelbrot/MandelbrotSet'
import TileNumber from './tile/TileNumber'
import MMap from './map/MMap'
import Vector2 from './common/Vector2'

(() => {
  const iteration = 100
  const mayBeTile: TileNumber | undefined = TileNumber.create(0, 0, 0)
  if (mayBeTile === undefined) {
    return
  }
  const tile: TileNumber = mayBeTile
  MandelbrotSet.draw('all', tile, iteration)

  new MMap('map', new Vector2(0, 0), 0)
})()
