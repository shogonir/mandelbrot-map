import Geometry from './Geometry'

export default class PlaneGeometry implements Geometry {

  vertices: number[]
  indices: number[]

  constructor(width: number) {
    const halfWidth = width / 2
    this.vertices = [
      -halfWidth, halfWidth, 0.0,
      -halfWidth, -halfWidth, 0.0,
      halfWidth, halfWidth, 0.0,
      halfWidth, -halfWidth, 0.0,
    ]
    this.indices = [
      0, 1, 2,
      1, 3, 2
    ]
  }
}