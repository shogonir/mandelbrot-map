export default class Numbers {
  
  static range(start: number, stop: number, step: number = 1, containsStop: boolean = false): number[] {
    const result = []
    const check = index => (containsStop) ? index <= stop : index < stop
    for (let index = start; check(index); index += step) {
      result.push(index)
    }
    return result
  }
}