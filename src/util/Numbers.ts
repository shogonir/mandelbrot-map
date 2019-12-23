export default class Numbers {
  
  static range(start: number, stop: number, step: number = 1): number[] {
    const result = []
    for (let index = start; index < stop; index += step) {
      result.push(index)
    }
    return result
  }
}