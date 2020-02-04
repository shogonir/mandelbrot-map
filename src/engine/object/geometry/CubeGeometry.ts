import Geometry from "./Geometry";

export default class CubeGeometry implements Geometry {
 
  vertices: number[]
  indices: number[]

  constructor(side: number) {
    const halfSide = side / 2
    this.vertices = [
      -halfSide, halfSide, -halfSide,
      -halfSide, halfSide, halfSide,
      halfSide, halfSide, halfSide,
      halfSide, halfSide, -halfSide,
      -halfSide, -halfSide, -halfSide,
      -halfSide, -halfSide, halfSide,
      halfSide, -halfSide, halfSide,
      halfSide, -halfSide, -halfSide
    ]
    this.indices = [
      0, 1, 2,
      0, 2, 3,
      0, 4, 5,
      0, 5, 1,
      1, 5, 6,
      1, 6, 2,
      2, 6, 7,
      2, 7, 3,
      3, 7, 4,
      3, 4, 0,
      5, 4, 7,
      5, 7, 6
    ]
  }
}