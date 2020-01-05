import { mat4 } from 'gl-matrix';

import GameObject from '../../object/GameObject';
import Vector3 from '../../../common/Vector3';
import Layer from '../layer/Layer';

export default interface Camera {

  position: Vector3
  target: Vector3
  upVector: Vector3

  viewMatrix: mat4
  projectionMatrix: mat4

  update(): void
  draw(layers: Layer[]): void
}