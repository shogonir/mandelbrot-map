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

  static gray(): Color {
    return new Color(0.47, 0.47, 0.47, 1.0)
  }

  static white(): Color {
    return new Color(1.0, 1.0, 1.0, 1.0)
  }

  static red(): Color {
    return new Color(1.0, 0, 0, 1.0)
  }

  static yellow(): Color {
    return new Color(1.0, 1.0, 0, 1.0)
  }

  static green(): Color {
    return new Color(0, 1.0, 0, 1.0)
  }

  static cyan(): Color {
    return new Color(0, 1.0, 1.0, 1.0)
  }

  static blue(): Color {
    return new Color(0, 0, 1.0, 1.0)
  }

  static magenta(): Color {
    return new Color(1.0, 0, 1.0, 1.0)
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

  static numberToColors6(index: number): Color {
    switch(index % 6) {
      case 0:
        return Color.red()
      case 1:
        return Color.yellow()
      case 2:
        return Color.green()
      case 3:
        return Color.cyan()
      case 4:
        return Color.blue()
      case 5:
        return Color.magenta()
      default:
        return Color.white()
    }
  }
}