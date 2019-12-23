import MandelbrotSet from './mandelbrot/MandelbrotSet'
import TileNumber from './tile/TileNumber'

const iteration = 20

MandelbrotSet.draw('topLeft', new TileNumber(-1, 1, 0), iteration)
MandelbrotSet.draw('top', new TileNumber(0, 1, 0), iteration)
MandelbrotSet.draw('topRight', new TileNumber(1, 1, 0), iteration)

MandelbrotSet.draw('left', new TileNumber(-1, 0, 0), iteration)
MandelbrotSet.draw('center', new TileNumber(0, 0, 0), iteration)
MandelbrotSet.draw('right', new TileNumber(1, 0, 0), iteration)

MandelbrotSet.draw('bottomLeft', new TileNumber(-1, -1, 0), iteration)
MandelbrotSet.draw('bottom', new TileNumber(0, -1, 0), iteration)
MandelbrotSet.draw('bottomRight', new TileNumber(1, -1, 0), iteration)