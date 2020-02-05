import Geometry from './Geometry'

export default class SphereGeometry implements Geometry {

  vertices: number[]
  indices: number[]

  constructor(radius: number) {
    this.vertices = []
    this.indices = []
    this.vertices.push(0, radius, 0)
    const maxRows = 4
    const maxCols = 8
    for (let row = 1; row < maxRows; row++) {
      const theta = Math.PI * row / maxRows
      for (let col = 0; col < maxCols; col++) {
        const phi = 2 * Math.PI * col / maxCols
        const x = radius * Math.sin(theta) * Math.cos(phi)
        const y = radius * Math.cos(theta)
        const z = radius * Math.sin(theta) * Math.sin(phi)
        this.vertices.push(x, y, z)
        if (row === 1) {
          if (col === maxCols - 1) {
            this.indices.push(0, col + 1, 1)
          } else {
            this.indices.push(0, col + 1, col + 2)
          }
        } else if (row === maxRows - 1) {
          if (col === maxCols - 1) {
            this.indices.push((row - 1) * maxCols + col + 1, maxCols * (maxRows - 1) + 1, (row - 1) * maxCols + 1)
          } else {
            this.indices.push((row - 1) * maxCols + col + 1, maxCols * (maxRows - 1) + 1, (row - 1) * maxCols + col + 2)
          }
        } 
        if (row !== 1) {
          if (col === maxCols - 1) {
            this.indices.push((row - 1) * maxCols, row * maxCols, (row - 1) * maxCols + 1)
            this.indices.push((row - 1) * maxCols, (row - 1) * maxCols + 1, (row - 2) * maxCols + 1)
          } else {
            this.indices.push((row - 2) * maxCols + col + 1, (row - 1) * maxCols + col + 1, (row - 1) * maxCols + col + 2)
            this.indices.push((row - 2) * maxCols + col + 1, (row - 1) * maxCols + col + 2, (row - 2) * maxCols + col + 2)
          }
        }
      }
    }
    this.vertices.push(0, -radius, 0)
  }
}