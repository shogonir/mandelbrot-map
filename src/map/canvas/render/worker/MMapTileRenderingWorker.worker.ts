import TileNumber from "../../../../tile/TileNumber"
import ComplexNumber from "../../../../common/ComplexNumber"
import MandelbrotSet from "../../../../mandelbrot/MandelbrotSet"

const worker: Worker = self as any

worker.addEventListener('message', (event: MessageEvent) => {
  const tile: TileNumber = event.data as TileNumber

  const canvas: OffscreenCanvas = new OffscreenCanvas(256, 256)
  const mayBeContext: OffscreenCanvasRenderingContext2D | null = canvas.getContext('2d')
  if (mayBeContext === null) {
    worker.postMessage(undefined)
    return
  }
  
  const context: OffscreenCanvasRenderingContext2D = mayBeContext
  const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const data: Uint8ClampedArray = imageData.data

  let pixelIndex = 0
  const top = tile.centerCoord.y + tile.half
  const bottom = tile.centerCoord.y - tile.half
  const right = tile.centerCoord.x + tile.half
  const left = tile.centerCoord.x - tile.half
  for (let y = top; y > bottom; y -= tile.side / canvas.height) {
    for (let x = left; x < right; x += tile.side / canvas.width) {
      const z = new ComplexNumber(x, y)
      const willConverge = MandelbrotSet.willConverge(z, 100)
      data[pixelIndex * 4 + 0] = 255 * willConverge  // r
      data[pixelIndex * 4 + 1] = 255 * willConverge  // g
      data[pixelIndex * 4 + 2] = 255 * willConverge  // b
      data[pixelIndex * 4 + 3] = 255  // a
      pixelIndex++;
    }
  }
  context.putImageData(imageData, 0, 0)

  const imageBitmap: ImageBitmap = canvas.transferToImageBitmap()
  worker.postMessage(imageBitmap, [imageBitmap])
})

export default worker
