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

  gl: WebGL2RenderingContext

  viewMatrix: mat4
  projectionMatrix: mat4

  constructor(
    gl: WebGL2RenderingContext,
    position: Vector3,
    target: Vector3,
    upVector: Vector3,
    verticalFov: number,
    aspect: number,
    near: number,
    far: number
  ) {
    this.gl = gl

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
    this.projectionMatrix = mat4.create()
    mat4.perspective(this.projectionMatrix, this.verticalFov * EngineMath.deg2Rad, this.aspect, this.near, this.far)
  }

  update() {
    this.updateView()
    this.updateProjection()
  }

  draw(layers: Layer[]) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    for (const layer of layers) {
      for (const gameObject of layer.gameObjects) {
        gameObject.update(this)
        gameObject.draw()
      }
    }
  }
}