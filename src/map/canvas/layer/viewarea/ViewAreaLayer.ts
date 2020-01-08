import Layer from '../../../../engine/world/layer/Layer'
import GameObject from '../../../../engine/object/GameObject'
import MMapStatus from '../../../status/MMapStatus'
import Vector3 from '../../../../common/Vector3'
import Quaternion from '../../../../common/Quaternion'
import SingleColorMaterial from '../../../../engine/object/material/SingleColorMaterial'
import PlaneGeometry from '../../../../engine/object/geometry/PlaneGeometry'
import Color from '../../../../common/Color'
import CanvasUtils from '../../../../util/CanvasUtils'
import Vector2 from '../../../../common/Vector2'
import EngineMath from '../../../../engine/common/EngineMath'
import Ray3 from '../../../../common/Ray3'

export default class ViewAreaLayer implements Layer {

  private static PointSidePixel: number = 8

  gameObjects: GameObject[]

  top: GameObject

  constructor(gl: WebGL2RenderingContext, status: MMapStatus) {
    this.gameObjects = []

    const plane = new PlaneGeometry(1.0)
    const redMaterial = new SingleColorMaterial(gl, plane, Color.red())

    this.top = new GameObject(
      Vector3.zero(),
      Quaternion.fromRadianAndVector3(0, new Vector3(0, 1, 0)),
      Vector3.one(),
      redMaterial
    )

    this.gameObjects.push(this.top)

    this.update(status)
  }

  update(status: MMapStatus) {
    ViewAreaLayer.updatePoint(this.top, status, new Vector2(0, 1))
  }

  static updatePoint(point: GameObject, status: MMapStatus, viewPoint: Vector2) {
    const ptu = CanvasUtils.calculatePixelToUnit(status.zoom)
    const side = ViewAreaLayer.PointSidePixel * ptu
    point.scale = new Vector3(side, side, side)

    const halfVerticalFovRadian = status.verticalFov / 2 * EngineMath.deg2Rad
    const halfHorizontalFovRadian = halfVerticalFovRadian * status.aspect
    const halfHeight = status.clientHeight * ptu / 2
    const halfWidth = status.clientWidth * ptu / 2
    const topRightVector = new Vector3(halfWidth, halfHeight, -status.cameraPosition.magnitude())

    topRightVector.x *= viewPoint.x
    topRightVector.y *= viewPoint.y

    const ray = new Ray3(status.cameraPosition, topRightVector)
    const intersection = ray.intersectsWithPlaneZ0().toVector2().add(status.center)

    point.position = status.mappingVector2(intersection).toVector3()
  }
}