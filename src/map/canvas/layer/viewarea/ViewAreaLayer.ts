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
import Ray3 from '../../../../common/Ray3'
import Material from '../../../../engine/object/material/Material'

export default class ViewAreaLayer implements Layer {

  private static PointSidePixel: number = 8

  gameObjects: GameObject[]

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

  topLeft: GameObject             // 00
  topTopLeft: GameObject          // 01
  top: GameObject                 // 02
  topTopRight: GameObject         // 03
  topRight: GameObject            // 04
  rightTopRight: GameObject       // 05
  right: GameObject               // 06
  rightBottomRight: GameObject    // 07
  bottomRight: GameObject         // 08
  bottomBottomRight: GameObject   // 09
  bottom: GameObject              // 10
  bottomBottomLeft: GameObject    // 11
  bottomLeft: GameObject          // 12
  leftBottomLeft: GameObject      // 13
  left: GameObject                // 14
  leftTopLeft: GameObject         // 15

  constructor(gl: WebGL2RenderingContext, status: MMapStatus) {
    this.gameObjects = []

    const plane = new PlaneGeometry(1.0)
    const redMaterial = new SingleColorMaterial(gl, plane, Color.red())

    this.topLeft = this.createPoint(redMaterial)
    this.topTopLeft = this.createPoint(redMaterial)
    this.top = this.createPoint(redMaterial)
    this.topTopRight = this.createPoint(redMaterial)
    this.topRight = this.createPoint(redMaterial)
    this.rightTopRight = this.createPoint(redMaterial)
    this.right = this.createPoint(redMaterial)
    this.rightBottomRight = this.createPoint(redMaterial)
    this.bottomRight = this.createPoint(redMaterial)
    this.bottomBottomRight = this.createPoint(redMaterial)
    this.bottom = this.createPoint(redMaterial)
    this.bottomBottomLeft = this.createPoint(redMaterial)
    this.bottomLeft = this.createPoint(redMaterial)
    this.leftBottomLeft = this.createPoint(redMaterial)
    this.left = this.createPoint(redMaterial)
    this.leftTopLeft = this.createPoint(redMaterial)

    this.gameObjects.push(this.topLeft)
    this.gameObjects.push(this.topTopLeft)
    this.gameObjects.push(this.top)
    this.gameObjects.push(this.topTopRight)
    this.gameObjects.push(this.topRight)
    this.gameObjects.push(this.rightTopRight)
    this.gameObjects.push(this.right)
    this.gameObjects.push(this.rightBottomRight)
    this.gameObjects.push(this.bottomRight)
    this.gameObjects.push(this.bottomBottomRight)
    this.gameObjects.push(this.bottom)
    this.gameObjects.push(this.bottomBottomLeft)
    this.gameObjects.push(this.bottomLeft)
    this.gameObjects.push(this.leftBottomLeft)
    this.gameObjects.push(this.left)
    this.gameObjects.push(this.leftTopLeft)

    this.update(status)
  }

  createPoint(material: Material): GameObject {
    return new GameObject(
      Vector3.zero(),
      Quaternion.fromRadianAndVector3(0, new Vector3(0, 1, 0)),
      Vector3.one(),
      material
    )
  }

  update(status: MMapStatus) {
    ViewAreaLayer.updatePoint(this.topLeft, status, new Vector2(-1, 1))
    ViewAreaLayer.updatePoint(this.topTopLeft, status, new Vector2(-0.5, 1))
    ViewAreaLayer.updatePoint(this.top, status, new Vector2(0, 1))
    ViewAreaLayer.updatePoint(this.topTopRight, status, new Vector2(0.5, 1))
    ViewAreaLayer.updatePoint(this.topRight, status, new Vector2(1, 1))
    ViewAreaLayer.updatePoint(this.rightTopRight, status, new Vector2(1, 0.5))
    ViewAreaLayer.updatePoint(this.right, status, new Vector2(1, 0))
    ViewAreaLayer.updatePoint(this.rightBottomRight, status, new Vector2(1, -0.5))
    ViewAreaLayer.updatePoint(this.bottomRight, status, new Vector2(1, -1))
    ViewAreaLayer.updatePoint(this.bottomBottomRight, status, new Vector2(0.5, -1))
    ViewAreaLayer.updatePoint(this.bottom, status, new Vector2(0, -1))
    ViewAreaLayer.updatePoint(this.bottomBottomLeft, status, new Vector2(-0.5, -1))
    ViewAreaLayer.updatePoint(this.bottomLeft, status, new Vector2(-1, -1))
    ViewAreaLayer.updatePoint(this.leftBottomLeft, status, new Vector2(-1, -0.5))
    ViewAreaLayer.updatePoint(this.left, status, new Vector2(-1, 0))
    ViewAreaLayer.updatePoint(this.leftTopLeft, status, new Vector2(-1, 0.5))
  }

  static updatePoint(point: GameObject, status: MMapStatus, viewPoint: Vector2) {
    const ptu = CanvasUtils.calculatePixelToUnit(status.zoom)
    const side = ViewAreaLayer.PointSidePixel * ptu
    point.scale = new Vector3(side, side, side)

    const halfHeight = status.clientHeight * ptu / 2
    const halfWidth = status.clientWidth * ptu / 2
    const toTopVector = status.polar.toUpVector3().normalize().multiply(halfHeight * viewPoint.y)
    const toRightVector = status.polar.toRightVector3().normalize().multiply(halfWidth * viewPoint.x)
    const toTopRightVector = toTopVector.add(toRightVector)

    const ray = new Ray3(status.cameraPosition, toTopRightVector.subtract(status.cameraPosition))
    const intersection = ray.intersectsWithPlaneZ0().toVector2().add(status.center)

    point.position = status.mappingVector2(intersection).toVector3()
  }
}