import GameObject from '../GameObject';
import Geometry from '../geometry/Geometry';
import Camera from '../../world/camera/Camera';
import Program from './program/Program';

export default interface Material {

  program: Program

  setup(geometry: Geometry): void

  update(gameObject: GameObject, camera: Camera): void

  draw(): void
}