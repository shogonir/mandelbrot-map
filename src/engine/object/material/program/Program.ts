import GameObject from '../../GameObject';
import Camera from '../../../world/camera/Camera';
import Geometry from '../../geometry/Geometry'

export default interface Program {

  gl: WebGL2RenderingContext
  program: WebGLProgram

  setup(gl: WebGL2RenderingContext, geometry: Geometry): void

  update(gameObject: GameObject, camera: Camera): void

  draw(): void
}