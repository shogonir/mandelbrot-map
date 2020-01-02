import Camera from './Camera'
import Vector3 from '../../../common/Vector3'
import { mat4 } from 'gl-matrix'

export default class PerspectiveCamera implements Camera {

  position: Vector3
  target: Vector3
  upVector: Vector3

  projectionMatrix: mat4
}