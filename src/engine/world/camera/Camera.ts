import { mat4 } from 'gl-matrix';

import GameObject from '../../object/GameObject';
import Vector3 from '../../../common/Vector3';

export default interface Camera {

  position: Vector3
  target: Vector3
  upVector: Vector3

  projectionMatrix: mat4
}