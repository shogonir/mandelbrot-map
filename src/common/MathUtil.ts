export default class MathUtil {

  /**
   * solve quadratic equation: a x^2 + b x + c = 0
   * @param a coefficient of x^2
   * @param b coefficient of x
   * @param c constant term
   */
  static solveQuadraticEquation(a: number, b: number, c: number): number[] {
    const discriminant = b ** 2 - 4 * a * c
    if (discriminant < 0) {
      return []
    }
    if (discriminant === 0) {
      return [ -b / (2 * a) ]
    }
    return [
      (-b + Math.sqrt(discriminant)) / (2 * a),
      (-b - Math.sqrt(discriminant)) / (2 * a)
    ]
  }
}