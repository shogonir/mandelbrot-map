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

  static red(): Color {
    return new Color(1.0, 0, 0, 1.0)
  }

  static green(): Color {
    return new Color(0, 1.0, 0, 1.0)
  }

  static blue(): Color {
    return new Color(0, 0, 1.0, 1.0)
  }

  static roseRed(): Color {
    return new Color(0.90, 0.15, 0.39, 1.0)
  }

  static emeraldGreen(): Color {
    return new Color(0.07, 0.68, 0.41, 1.0)
  }

  static turquoiseBlue(): Color {
    return new Color(0, 0.65, 0.71, 1.0)
  }

  static delftBlue(): Color {
    return new Color(0, 0.08, 0.2, 1.0)
  }

  static midnightBlue(): Color {
    return new Color(0, 0.12, 0.26, 1.0)
  }
}