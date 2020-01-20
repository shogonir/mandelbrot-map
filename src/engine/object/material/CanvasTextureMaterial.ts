import Material from './Material'
import CanvasTextureProgram from './program/CanvasTextureProgram'
import Geometry from '../geometry/Geometry'
import GameObject from '../GameObject'
import Camera from '../../world/camera/Camera'

export default class CanvasTextureMaterial implements Material {

  gl: WebGL2RenderingContext
  program: CanvasTextureProgram
  geometry: Geometry

  constructor(gl: WebGL2RenderingContext, geometry: Geometry, canvas: HTMLCanvasElement) {
    this.gl = gl
    this.geometry = geometry

    this.program = new CanvasTextureProgram()
    this.setup(geometry)
    this.program.setTexture(canvas)
  }

  setup(geometry: Geometry) {
    this.program.setup(this.gl, geometry)
  }

  update(gameObject: GameObject, camera: Camera) {
    this.program.update(gameObject, camera)
  }

  draw() {
    this.program.draw()
  }
}