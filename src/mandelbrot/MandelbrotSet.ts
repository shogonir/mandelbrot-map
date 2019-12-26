import ComplexNumber from '../complex/ComplexNumber'
import TileNumber from '../tile/TileNumber'

import Numbers from '../util/Numbers'

export default class MandelbrotSet {

  static willConverge(c: ComplexNumber, iteration: number): number {
    let z = new ComplexNumber(0, 0)
    for (let index of Numbers.range(0, iteration)) {
      z = z.multiply(z).add(c)
      if (z.abs() > 2) {
        return index / iteration
      }
    }
    return 1.0
  }

  static draw(id: string, tile: TileNumber, iteration: number) {
    const mayBeElement: HTMLElement | null = document.getElementById(id)
    if (mayBeElement === null) {
      console.error(`could not get element, id: ${id}`)
      return
    }
    const element: HTMLElement = mayBeElement
    
    const canvas: HTMLCanvasElement = element as HTMLCanvasElement
    const mayBeContext: CanvasRenderingContext2D | null = canvas.getContext('2d')
    if (mayBeContext === null) {
      console.log(`could not get context, id: ${id}`)
      return
    }

    const context: CanvasRenderingContext2D = mayBeContext
    const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data: Uint8ClampedArray = imageData.data

    let pixelIndex = 0
    for (let y = tile.top(); y > tile.bottom(); y -= tile.side / canvas.height) {
      for (let x = tile.left(); x < tile.right(); x += tile.side / canvas.width) {
        const z = new ComplexNumber(x, y)
        const willConverge = MandelbrotSet.willConverge(z, iteration)
        data[pixelIndex * 4 + 0] = 255 * willConverge  // r
        data[pixelIndex * 4 + 1] = 255 * willConverge  // g
        data[pixelIndex * 4 + 2] = 255 * willConverge  // b
        data[pixelIndex * 4 + 3] = 255  // a
        // if (willConverge) {
        //   data[pixelIndex * 4 + 0] = 255
        //   data[pixelIndex * 4 + 1] = 255
        //   data[pixelIndex * 4 + 2] = 255
        //   data[pixelIndex * 4 + 3] = 255
        // } else {
        //   data[pixelIndex * 4 + 0] = 0
        //   data[pixelIndex * 4 + 1] = 0
        //   data[pixelIndex * 4 + 2] = 0
        //   data[pixelIndex * 4 + 3] = 255
        // }
        pixelIndex++;
      }
    }

    context.putImageData(imageData, 0, 0)
  }
}