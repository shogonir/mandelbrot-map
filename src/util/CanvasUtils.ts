export default class CanvasUtils {

  static calculatePixelToUnit(zoom: number): number {
    return 2 ** (-zoom - 6)
  }

  static calculateUnitToPixel(zoom: number): number {
    return 1.0 / CanvasUtils.calculatePixelToUnit(zoom)
  }
}