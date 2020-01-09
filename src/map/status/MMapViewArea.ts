import Vector3 from '../../common/Vector3'
import GameObject from '../../engine/object/GameObject'
import MMapStatus from './MMapStatus'
import Vector2 from '../../common/Vector2'
import CanvasUtils from '../../util/CanvasUtils'
import Ray3 from '../../common/Ray3'

export default class MMapViewArea {

  /**
   *   00--01--02--03--04
   *   |                |
   *   15              05
   *   |                |
   *   14              06
   *   |                |
   *   13              07
   *   |                |
   *   12--11--10--09--08
   */

  topLeft: Vector3 | undefined            // 00
  topTopLeft: Vector3 | undefined         // 01
  top: Vector3 | undefined                // 02
  topTopRight: Vector3 | undefined        // 03
  topRight: Vector3 | undefined           // 04
  rightTopRight: Vector3 | undefined      // 05
  right: Vector3 | undefined              // 06
  rightBottomRight: Vector3 | undefined   // 07
  bottomRight: Vector3 | undefined        // 08
  bottomBottomRight: Vector3 | undefined  // 09
  bottom: Vector3 | undefined             // 10
  bottomBottomLeft: Vector3 | undefined   // 11
  bottomLeft: Vector3 | undefined         // 12
  leftBottomLeft: Vector3 | undefined     // 13
  left: Vector3 | undefined               // 14
  leftTopLeft: Vector3 | undefined        // 15

  constructor(status: MMapStatus) {
    this.update(status)
  }

  update(status: MMapStatus) {
    this.topLeft = MMapViewArea.updatePoint(status, new Vector2(-1, 1))
    this.topTopLeft = MMapViewArea.updatePoint(status, new Vector2(-0.5, 1))
    this.top = MMapViewArea.updatePoint(status, new Vector2(0, 1))
    this.topTopRight = MMapViewArea.updatePoint(status, new Vector2(0.5, 1))
    this.topRight = MMapViewArea.updatePoint(status, new Vector2(1, 1))
    this.rightTopRight = MMapViewArea.updatePoint(status, new Vector2(1, 0.5))
    this.right = MMapViewArea.updatePoint(status, new Vector2(1, 0))
    this.rightBottomRight = MMapViewArea.updatePoint(status, new Vector2(1, -0.5))
    this.bottomRight = MMapViewArea.updatePoint(status, new Vector2(1, -1))
    this.bottomBottomRight = MMapViewArea.updatePoint(status, new Vector2(0.5, -1))
    this.bottom = MMapViewArea.updatePoint(status, new Vector2(0, -1))
    this.bottomBottomLeft = MMapViewArea.updatePoint(status, new Vector2(-0.5, -1))
    this.bottomLeft = MMapViewArea.updatePoint(status, new Vector2(-1, -1))
    this.leftBottomLeft = MMapViewArea.updatePoint(status, new Vector2(-1, -0.5))
    this.left = MMapViewArea.updatePoint(status, new Vector2(-1, 0))
    this.leftTopLeft = MMapViewArea.updatePoint(status, new Vector2(-1, 0.5))
  }

  static updatePoint(status: MMapStatus, viewPoint: Vector2): Vector3 | undefined {
    const ptu = CanvasUtils.calculatePixelToUnit(status.zoom)
    const halfHeight = status.clientHeight * ptu / 2
    const halfWidth = status.clientWidth * ptu / 2
    const toTopVector = status.polar.toUpVector3().normalize().multiply(halfHeight * viewPoint.y)
    const toRightVector = status.polar.toRightVector3().normalize().multiply(halfWidth * viewPoint.x)
    const toTopRightVector = toTopVector.add(toRightVector)

    const ray = new Ray3(status.cameraPosition, toTopRightVector.subtract(status.cameraPosition))
    const mayBeIntersection: Vector3 | undefined = ray.intersectsWithPlaneZ0()

    if (mayBeIntersection === undefined) {
      return undefined
    }

    const intersection = ray.intersectsWithPlaneZ0().toVector2().add(status.center)
    return status.mappingVector2(intersection).toVector3()
  }
}