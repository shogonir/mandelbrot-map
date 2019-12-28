export default class CanvasUtils {

  static calculatePixelPerUnit(zoom: number): number {
    return 2 ** (-zoom - 6)
  }
}