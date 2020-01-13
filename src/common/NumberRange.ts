export default class NumberRange {

  min: number
  max: number

  constructor(min: number, max: number) {
    if (min > max) {
      const swap = min
      min = max
      max = swap
    }
    this.min = min
    this.max = max
  }

  clone(): NumberRange {
    return new NumberRange(this.min, this.max)
  }

  expand(value: number) {
    if (value < this.min) {
      this.min = value
    }
    if (value > this.max) {
      this.max = value
    }
  }

  merge(other: NumberRange): NumberRange {
    const min = other.min < this.min ? other.min : this.min
    const max = other.max > this.max ? other.max : this.max
    return new NumberRange(min, max)
  }
}