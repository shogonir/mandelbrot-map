import Vector2 from '../../common/Vector2'
import CanvasUtils from '../../util/CanvasUtils'
import PolarCoordinate3 from '../../common/PolarCoordinate3'
import Vector3 from '../../common/Vector3'
import EngineMath from '../../engine/common/EngineMath'
import MMapViewArea from './MMapViewArea'
import MMapUtils from '../util/MMapUtils'
import Quaternion from '../../common/Quaternion'

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

  isEarthMode: boolean

  viewArea: MMapViewArea

  mapUpdate: (() => void) | undefined

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
    this.isEarthMode = false
    this.update()
    this.viewArea = new MMapViewArea(this)
    this.mapUpdate = undefined
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
    const centerPosition = MMapStatus.complexToPosition(this.center.clone())
    const centerRotation = MMapStatus.complexToRotation(this.center)
    const inverseRotation = centerRotation.inverse()
    const targetPosition = MMapStatus.complexToPosition(v.clone())
    const result = inverseRotation.product(targetPosition.subtract(centerPosition))
    return result
  }

  static complexToRotation(v: Vector2): Quaternion {
    return Quaternion.fromRadianAndAxis(0, new Vector3(0, 1, 0))
      .rotateX(MMapStatus.yToRadian(v.y))
      .rotateY(-MMapStatus.xToRadian(v.x))
  }

  static complexToRotationForTile(v: Vector2): Quaternion {
    return Quaternion.fromRadianAndAxis(0, new Vector3(0, 1, 0))
      .rotateY(-MMapStatus.xToRadian(v.x))
  }

  private static complexToPosition(v: Vector2): Vector3 {
    const theta = MMapStatus.yToRadian(v.y)
    const phi = MMapStatus.xToRadian(v.x)
    const radius = MMapUtils.SqhereRadius
    const x = radius * Math.cos(theta) * Math.sin(phi)
    const y = radius * Math.sin(theta)
    const z = radius * Math.cos(theta) * Math.cos(phi)
    return new Vector3(x, y, z)
  }

  private static xToRadian(x: number): number {
    return x * Math.PI / 2
  }

  private static yToRadian(y: number): number {
    return 0.95 * y * Math.PI / 4
  }
}