import Geometry from './Geometry'

export default class CircleGeometry implements Geometry {

  vertices: number[]
  indices: number[]

  constructor(radius: number) {
    this.vertices = []
    this.indices = []

    this.vertices.push(0, 0, 0)
    const numTriangles = 32
    for (let index = 0; index < numTriangles; index++) {
      const radian = 2 * Math.PI * index / numTriangles
      const x = radius * Math.cos(radian)
      const y = radius * Math.sin(radian)
      this.vertices.push(x, y, 0)

      if (index === numTriangles - 1) {
        this.indices.push(0, index + 1, 1)
      } else {
        this.indices.push(0, index + 1, index + 2)
      }
    }
  }
}