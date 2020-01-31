import Equalable from './Equalable'

export default class ArrayList<T extends Equalable> implements Iterable<T> {

  private array: T[]

  *[Symbol.iterator](): Iterator<T> {
    for (let index = 0; index < this.array.length; index++) {
      yield this.array[index]
    }
  }

  private constructor(array: T[]) {
    this.array = [...array]
  }

  static empty<T extends Equalable>(): ArrayList<T> {
    return new ArrayList([])
  }

  static from<T extends Equalable>(elements: T[]): ArrayList<T> {
    return new ArrayList(elements)
  }

  get(index: number): T {
    if (index < 0 || index >= this.size()) {
      throw new Error(`ArrayList.get(index: number) throws error out of bounds. 'index': ${index}`)
    }

    return this.array[index]
  }

  push(...elements: T[]) {
    this.array.push(...elements)
  }

  size(): number {
    return this.array.length
  }

  clear() {
    this.array = []
  }

  indexOf(element: T): number {
    for (let index = 0; index < this.array.length; index++) {
      if (this.array[index].equals(element)) {
        return index
      }
    }
    return -1
  }

  contains(element: T): boolean {
    return this.indexOf(element) !== -1
  }

  remove(element: T) {
    for (let index = 0; index < this.array.length; index++) {
      if (this.array[index].equals(element)) {
        this.array.splice(index, 1)
        return
      }
    }
  }

  removeAll(element: T) {
    for (let index = 0; index < this.array.length; index++) {
      if (this.array[index].equals(element)) {
        this.array.splice(index, 1)
        index -= 1
      }
    }
  }

  map<U extends Equalable>(mapping: (element: T, index?: number, arrayList?: ArrayList<T>) => U): ArrayList<U> {
    return ArrayList.from(this.mapToArray(mapping))
  }

  mapToArray<U>(mapping: (element: T, index?: number, arrayList?: ArrayList<T>) => U): U[] {
    return this.array.map((element: T, index: number) => mapping(element, index, this))
  }

  forEach(callback: (currentValue: T, index: number, array: ArrayList<T>) => void) {
    this.array.forEach((current, i) => callback(current, i, this))
  }

  toArray(): T[] {
    return this.array
  }
}