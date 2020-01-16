import Geometry from './Geometry'

export default class NoneGeometry implements Geometry {

  vertices: number[]
  indices: number[]

  constructor() {
    this.vertices = []
    this.indices = []
  }
}