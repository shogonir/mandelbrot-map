export default class Color {

  r: number
  g: number
  b: number
  a: number

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  static black(): Color {
    return new Color(0, 0, 0, 1.0)
  }

  static blue(): Color {
    return new Color(0, 0, 1.0, 1.0)
  }
}