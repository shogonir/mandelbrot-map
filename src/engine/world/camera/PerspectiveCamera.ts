import Camera from './Camera'
import Vector3 from '../../../common/Vector3'
import { mat4 } from 'gl-matrix'
import EngineMath from '../../common/EngineMath'
import Layer from '../layer/Layer'

export default class PerspectiveCamera implements Camera {

  position: Vector3
  target: Vector3
  upVector: Vector3

  verticalFov: number
  aspect: number          // width / height
  near: number
  far: number

  viewMatrix: mat4
  projectionMatrix: mat4

  constructor(position: Vector3, target: Vector3, upVector: Vector3, verticalFov: number, aspect: number, near: number, far: number) {
    this.position = position
    this.target = target
    this.upVector = upVector
    this.updateView()

    this.verticalFov = verticalFov
    this.aspect = aspect
    this.near = near
    this.far = far
    this.updateProjection()
  }

  updateView() {
    this.viewMatrix  = mat4.create()
    mat4.lookAt(this.viewMatrix, this.position.toArray(), this.target.toArray(), this.upVector.toArray())
  }

  updateProjection() {
    const horizontalFov = this.verticalFov * this.aspect
    const halfHeight = this.near * Math.tan(this.verticalFov / 2 * EngineMath.deg2Rad)
    const halfWidth = this.near * Math.tan(horizontalFov / 2 * EngineMath.deg2Rad)
    this.projectionMatrix = mat4.create()
    mat4.frustum(this.projectionMatrix, -halfWidth, halfWidth, -halfHeight, halfHeight, this.near, this.far)
  }

  update() {

  }

  draw(layers: Layer[]) {
    for (const layer of layers) {
      for (const gameObject of layer.gameObjects) {
        gameObject.update(this)
        gameObject.draw()
      }
    }
  }
}