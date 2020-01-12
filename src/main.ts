import MandelbrotSet from './mandelbrot/MandelbrotSet'
import TileNumber from './tile/TileNumber'
import MMap from './map/MMap'
import Vector2 from './common/Vector2'

const iteration = 100
MandelbrotSet.draw('all', TileNumber.create(0, 0, 0), iteration)

new MMap('map', new Vector2(0, 0), 0)