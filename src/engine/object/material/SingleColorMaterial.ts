import Material from './Material';
import GameObject from '../GameObject';
import Geometry from '../geometry/Geometry';
import Camera from '../../world/camera/Camera';
import SingleColorProgram from './program/SingleColorProgram';
import Color from '../../../common/Color';

export default class SingleColorMaterial implements Material {

  program: SingleColorProgram

  color: Color

  constructor(color: Color) {
    this.color = color
    this.program = new SingleColorProgram()
  }

  setup(geometry: Geometry) {
  }

  update(gameObject: GameObject, camera: Camera) {

  }

  draw() {

  }
}