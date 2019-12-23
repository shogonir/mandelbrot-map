import ComplexNumber from '../complex/ComplexNumber'

import Numbers from '../util/Numbers'

export default class MandelbrotSet {

  static willConverge(c: ComplexNumber, iteration: number): boolean {
    let z = new ComplexNumber(0, 0)
    for (let index of Numbers.range(0, iteration)) {
      z = z.multiply(z).add(c)
      if (z.abs() > 2) {
        return false
      }
    }
    return true
  }
}