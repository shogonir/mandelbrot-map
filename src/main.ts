import ComplexNumber from './complex/ComplexNumber'

import MandelbrotSet from './mandelbrot/MandelbrotSet'

for (let y = -1; y <= 1; y++) {
  for (let x = -1; x <= 1; x++) {
    const z = new ComplexNumber(x, y)
    console.log(x, y)
    console.log(MandelbrotSet.willConverge(z, 20))
  }
}