import Geometry from './Geometry'

export default class ConeGeometry implements Geometry {

  vertices: number[]
  indices: number[]

  constructor(height: number, radius: number) {
    this.vertices = []
    this.indices = []

    this.vertices.push(0, height / 2, 0)
    const maxCols: number = 8
    const y: number = - height / 2
    const lastIndex: number = maxCols + 1
    for (let col: number = 0; col < maxCols; col++) {
      const radian: number = 2 * Math.PI * (col / maxCols)
      const x: number = radius * Math.cos(radian)
      const z: number = radius * Math.sin(radian)
      this.vertices.push(x, y, z)

      // indices
      if (col === maxCols - 1) {
        this.indices.push(0, maxCols, 1)
        this.indices.push(lastIndex, 1, maxCols)
      } else {
        this.indices.push(0, col + 1, col + 2)
        this.indices.push(lastIndex, col + 2, col + 1)
      }
    }
    this.vertices.push(0, y, 0)

    console.log(`vertices(${this.vertices.length / 3})`)
    for (let index = 0; index < this.vertices.length; index += 3) {
      console.log(this.vertices[index], this.vertices[index + 1], this.vertices[index + 2])
    }

    console.log('')

    console.log(`indices(${this.indices.length})`)
    for (let index = 0; index < this.indices.length; index += 3) {
      console.log(this.indices[index], this.indices[index + 1], this.indices[index + 2])
    }
  }
}