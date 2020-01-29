import Geometry from './Geometry'

export default class TexturePlaneGeometry implements Geometry {

  vertices: number[]
  indices: number[]

  constructor(width: number) {
    const halfWidth = width / 2
    this.vertices = [
      -halfWidth, halfWidth, 0.0,
      0.0, 1.0,
      -halfWidth, -halfWidth, 0.0,
      0.0, 0.0,
      halfWidth, halfWidth, 0.0,
      1.0, 1.0,
      halfWidth, -halfWidth, 0.0,
      1.0, 0.0
    ]
    this.indices = [
      0, 2, 1,
      1, 2, 3
    ]
  }
}