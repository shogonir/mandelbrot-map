import Material from './Material';
import GameObject from '../GameObject';
import Geometry from '../geometry/Geometry';
import Camera from '../../world/camera/Camera';
import SingleColorProgram from './program/SingleColorProgram';
import Color from '../../../common/Color';

export default class SingleColorMaterial implements Material {

  gl: WebGL2RenderingContext
  program: SingleColorProgram
  geometry: Geometry

  color: Color

  constructor(gl: WebGL2RenderingContext, geometry: Geometry, color: Color) {
    this.gl = gl
    this.geometry = geometry
    this.color = color

    this.program = new SingleColorProgram()
    this.setup(geometry)
    this.program.setColor(this.color)
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