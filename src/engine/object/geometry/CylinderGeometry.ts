import Geometry from './Geometry'

export default class CylinderGeometry implements Geometry {

  vertices: number[]
  indices: number[]

  constructor(height: number, radius: number) {
    this.vertices = []
    this.indices = []

    this.vertices.push(0, height / 2, 0)
    const maxCols: number = 32
    const lastIndex: number = maxCols * 2 + 1

    // top
    for (let col: number = 0; col < maxCols; col++) {
      const radian: number = 2 * Math.PI * (col / maxCols)
      const x: number = radius * Math.cos(radian)
      const z: number = radius * Math.sin(radian)
      this.vertices.push(x, height / 2, z)

      // indices
      if (col === maxCols - 1) {
        this.indices.push(0, col + 1, 1)
      } else {
        this.indices.push(0, col + 1, col + 2)
      }
    }

    // bottom
    for (let col: number = 0; col < maxCols; col++) {
      const radian: number = 2 * Math.PI * (col / maxCols)
      const x: number = radius * Math.cos(radian)
      const z: number = radius * Math.sin(radian)
      this.vertices.push(x, -height / 2, z)

      // wall indices
      if (col === maxCols - 1) {
        this.indices.push(col + 1, maxCols + col + 1, maxCols + 1)
        this.indices.push(col + 1, maxCols + 1, 1)
      } else {
        this.indices.push(col + 1, maxCols + col + 1, maxCols + col + 2)
        this.indices.push(col + 1, maxCols + col + 2, col + 2)
      }

      // bottom indices
      if (col === maxCols - 1) {
        this.indices.push(lastIndex, maxCols + 1, maxCols + col + 1)
      } else {
        this.indices.push(lastIndex, maxCols + col + 2, maxCols + col + 1)
      }
    }
    this.vertices.push(0, -height / 2, 0)
  }
}