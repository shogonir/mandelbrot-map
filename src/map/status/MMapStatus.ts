import Vector2 from '../../common/Vector2'
import CanvasUtils from '../../util/CanvasUtils'
import PolarCoordinate3 from '../../common/PolarCoordinate'
import Vector3 from '../../common/Vector3'
import EngineMath from '../../engine/common/EngineMath'

export default class MMapStatus {

  center: Vector2
  zoom: number

  clientWidth: number
  clientHeight: number

  polar: PolarCoordinate3

  cameraPosition: Vector3
  cameraUp: Vector3
  cameraTarget: Vector3
  
  verticalFov: number
  aspect: number

  minUnit: Vector2  // deprecated
  maxUnit: Vector2  // deprecated

  constructor(
    center: Vector2,
    zoom: number,
    clientWidth: number,
    clientHeight: number,
    polar: PolarCoordinate3,
    cameraTarget: Vector3,
  ) {
    this.center = center
    this.zoom = zoom
    this.clientWidth = clientWidth
    this.clientHeight = clientHeight
    this.polar = polar
    this.cameraTarget = cameraTarget
    this.aspect = clientWidth / clientHeight
  }

  update() {
    const ptu = CanvasUtils.calculatePixelToUnit(this.zoom)
    const halfWidth = this.clientWidth / 2
    const halfHeight = this.clientHeight / 2
    this.minUnit = new Vector2(this.center.x - (halfWidth * ptu), this.center.y - (halfHeight * ptu))
    this.maxUnit = new Vector2(this.center.x + (halfWidth * ptu), this.center.y + (halfHeight * ptu))

    this.cameraPosition = this.polar.toVector3()
    this.cameraUp = this.polar.toUpVector3()

    const toHalf = 0.5
    const halfVerticalFovRadian = Math.atan(this.clientHeight * ptu * toHalf / this.cameraPosition.magnitude())
    this.verticalFov = halfVerticalFovRadian * 2 * EngineMath.rad2Deg
  }

  mappingX(x: number): number {
    return x - this.center.x
  }

  mappingY(y: number): number {
    return y - this.center.y
  }

  mappingVector2(v: Vector2): Vector2 {
    return new Vector2(this.mappingX(v.x), this.mappingY(v.y))
  }
}