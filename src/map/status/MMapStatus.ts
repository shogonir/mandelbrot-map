import Vector2 from '../../common/Vector2'
import CanvasUtils from '../../util/CanvasUtils'
import PolarCoordinate3 from '../../common/PolarCoordinate3'
import Vector3 from '../../common/Vector3'
import EngineMath from '../../engine/common/EngineMath'
import MMapViewArea from './MMapViewArea'
import MMapUtils from '../util/MMapUtils'

export default class MMapStatus {

  center: Vector2
  zoom: number
  zoomAsInt: number

  clientWidth: number
  clientHeight: number

  polar: PolarCoordinate3

  cameraPosition: Vector3
  cameraUp: Vector3
  cameraTarget: Vector3
  
  verticalFov: number
  aspect: number

  viewArea: MMapViewArea

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
    this.update()
    this.viewArea = new MMapViewArea(this)
  }

  update() {
    this.zoomAsInt = Math.ceil(this.zoom)

    const ptu = CanvasUtils.calculatePixelToUnit(this.zoom)

    const polarPosition = this.polar.toVector3()
    this.cameraPosition = polarPosition.addZ(MMapUtils.SqhereRadius)
    this.cameraUp = this.polar.toUpVector3()

    const toHalf = 0.5
    const halfVerticalFovRadian = Math.atan(this.clientHeight * ptu * toHalf / polarPosition.magnitude())
    this.verticalFov = halfVerticalFovRadian * 2 * EngineMath.rad2Deg

    if (this.viewArea !== undefined) {
      this.viewArea.update(this)
    }
  }

  mapping(v: Vector2): Vector3 {
    return new Vector3(v.x - this.center.x, v.y - this.center.y, MMapUtils.SqhereRadius)
  }
}