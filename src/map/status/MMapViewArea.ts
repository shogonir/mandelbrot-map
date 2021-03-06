import Vector3 from '../../common/Vector3'
import MMapStatus from './MMapStatus'
import Vector2 from '../../common/Vector2'
import CanvasUtils from '../../util/CanvasUtils'
import Ray3 from '../../common/Ray3'
import MMapUtils from '../util/MMapUtils'
import MMapViewTiles from './MMapViewTiles'

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

  topLeft: Vector3            // 00
  topTopLeft: Vector3         // 01
  top: Vector3                // 02
  topTopRight: Vector3        // 03
  topRight: Vector3           // 04
  rightTopRight: Vector3      // 05
  right: Vector3              // 06
  rightBottomRight: Vector3   // 07
  bottomRight: Vector3        // 08
  bottomBottomRight: Vector3  // 09
  bottom: Vector3             // 10
  bottomBottomLeft: Vector3   // 11
  bottomLeft: Vector3         // 12
  leftBottomLeft: Vector3     // 13
  left: Vector3               // 14
  leftTopLeft: Vector3        // 15

  points: Vector3[]

  viewTiles: MMapViewTiles

  constructor(status: MMapStatus) {
    this.viewTiles = new MMapViewTiles()
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
    
    this.points = []
    this.points.push(this.topLeft)
    this.points.push(this.topTopLeft)
    this.points.push(this.top)
    this.points.push(this.topTopRight)
    this.points.push(this.topRight)
    this.points.push(this.rightTopRight)
    this.points.push(this.right)
    this.points.push(this.rightBottomRight)
    this.points.push(this.bottomRight)
    this.points.push(this.bottomBottomRight)
    this.points.push(this.bottom)
    this.points.push(this.bottomBottomLeft)
    this.points.push(this.bottomLeft)
    this.points.push(this.leftBottomLeft)
    this.points.push(this.left)
    this.points.push(this.leftTopLeft)

    this.viewTiles.update(status)
  }

  static updatePoint(status: MMapStatus, viewPoint: Vector2): Vector3 {
    const ptu = CanvasUtils.calculatePixelToUnit(status.zoom)
    const z = MMapUtils.SqhereRadius

    const halfHeight = status.clientHeight * ptu / 2
    const halfWidth = status.clientWidth * ptu / 2
    const toTopVector = status.polar.toUpVector3().normalize().multiply(halfHeight * viewPoint.y)
    const toRightVector = status.polar.toRightVector3().normalize().multiply(halfWidth * viewPoint.x)
    const toTopRightVector = toTopVector.add(toRightVector).addZ(z)

    const ray = new Ray3(status.cameraPosition, toTopRightVector.subtract(status.cameraPosition))
    const mayBeIntersection: Vector3 | undefined = ray.intersectsWithPlaneZEqualsParameter(z)

    if (mayBeIntersection === undefined) {
      return Vector3.zero()
    }

    const intersection = mayBeIntersection
    return intersection.addX(status.center.x).addY(status.center.y)
  }
}