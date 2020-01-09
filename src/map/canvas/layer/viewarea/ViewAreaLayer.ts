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
    const ptu = CanvasUtils.calculatePixelToUnit(status.zoom)
    const side = ViewAreaLayer.PointSidePixel * ptu
    this.gameObjects.forEach((gameObject: GameObject) => {
      gameObject.scale = new Vector3(side, side, side)
    })

    this.topLeft.position = status.mappingVector2(status.viewArea.topLeft.toVector2()).toVector3()
    this.topTopLeft.position = status.mappingVector2(status.viewArea.topTopLeft.toVector2()).toVector3()
    this.top.position = status.mappingVector2(status.viewArea.top.toVector2()).toVector3()
    this.topTopRight.position = status.mappingVector2(status.viewArea.topTopRight.toVector2()).toVector3()
    this.topRight.position = status.mappingVector2(status.viewArea.topRight.toVector2()).toVector3()
    this.rightTopRight.position = status.mappingVector2(status.viewArea.rightTopRight.toVector2()).toVector3()
    this.right.position = status.mappingVector2(status.viewArea.right.toVector2()).toVector3()
    this.rightBottomRight.position = status.mappingVector2(status.viewArea.rightBottomRight.toVector2()).toVector3()
    this.bottomRight.position = status.mappingVector2(status.viewArea.bottomRight.toVector2()).toVector3()
    this.bottomBottomRight.position = status.mappingVector2(status.viewArea.bottomBottomRight.toVector2()).toVector3()
    this.bottom.position = status.mappingVector2(status.viewArea.bottom.toVector2()).toVector3()
    this.bottomBottomLeft.position = status.mappingVector2(status.viewArea.bottomBottomLeft.toVector2()).toVector3()
    this.bottomLeft.position = status.mappingVector2(status.viewArea.bottomLeft.toVector2()).toVector3()
    this.leftBottomLeft.position = status.mappingVector2(status.viewArea.leftBottomLeft.toVector2()).toVector3()
    this.left.position = status.mappingVector2(status.viewArea.left.toVector2()).toVector3()
    this.leftTopLeft.position = status.mappingVector2(status.viewArea.leftTopLeft.toVector2()).toVector3()
  }
}