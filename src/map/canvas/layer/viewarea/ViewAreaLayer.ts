import Layer from '../../../../engine/world/layer/Layer'
import GameObject from '../../../../engine/object/GameObject'
import MMapStatus from '../../../status/MMapStatus'
import Vector3 from '../../../../common/Vector3'
import Quaternion from '../../../../common/Quaternion'
import SingleColorMaterial from '../../../../engine/object/material/SingleColorMaterial'
import PlaneGeometry from '../../../../engine/object/geometry/PlaneGeometry'
import Color from '../../../../common/Color'
import CanvasUtils from '../../../../util/CanvasUtils'
import Material from '../../../../engine/object/material/Material'
import MMapUtils from '../../../util/MMapUtils'
import CubeGeometry from '../../../../engine/object/geometry/CubeGeometry'

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

  centerBox: GameObject
  centerBoxRotationX: number
  centerBoxRotationY: number
  centerBoxRotationZ: number

  constructor(gl: WebGL2RenderingContext, status: MMapStatus) {
    this.gameObjects = []

    const plane = new PlaneGeometry(1.0)
    const redMaterial = new SingleColorMaterial(gl, plane, Color.roseRed())

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

    this.centerBoxRotationX = 0
    this.centerBoxRotationY = 0
    this.centerBoxRotationZ = 0
    const rotation = Quaternion.fromRadianAndAxis(0, new Vector3(0, 1, 0))
      .rotateX(this.centerBoxRotationX)
      .rotateY(this.centerBoxRotationY)
      .rotateZ(this.centerBoxRotationZ)
    const cubeGeometry = new CubeGeometry(4.0)
    const centerBoxMaterial = new SingleColorMaterial(gl, cubeGeometry, Color.red())
    this.centerBox = new GameObject(
      Vector3.zero(),
      rotation,
      Vector3.one().multiply(4),
      centerBoxMaterial
    )

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

    this.gameObjects.push(this.centerBox)

    this.update(status)
  }

  createPoint(material: Material): GameObject {
    return new GameObject(
      Vector3.zero(),
      Quaternion.fromRadianAndAxis(0, new Vector3(0, 1, 0)),
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

    this.topLeft.position = status.mapping(status.viewArea.topLeft.toVector2())
    this.topTopLeft.position = status.mapping(status.viewArea.topTopLeft.toVector2())
    this.top.position = status.mapping(status.viewArea.top.toVector2())
    this.topTopRight.position = status.mapping(status.viewArea.topTopRight.toVector2())
    this.topRight.position = status.mapping(status.viewArea.topRight.toVector2())
    this.rightTopRight.position = status.mapping(status.viewArea.rightTopRight.toVector2())
    this.right.position = status.mapping(status.viewArea.right.toVector2())
    this.rightBottomRight.position = status.mapping(status.viewArea.rightBottomRight.toVector2())
    this.bottomRight.position = status.mapping(status.viewArea.bottomRight.toVector2())
    this.bottomBottomRight.position = status.mapping(status.viewArea.bottomBottomRight.toVector2())
    this.bottom.position = status.mapping(status.viewArea.bottom.toVector2())
    this.bottomBottomLeft.position = status.mapping(status.viewArea.bottomBottomLeft.toVector2())
    this.bottomLeft.position = status.mapping(status.viewArea.bottomLeft.toVector2())
    this.leftBottomLeft.position = status.mapping(status.viewArea.leftBottomLeft.toVector2())
    this.left.position = status.mapping(status.viewArea.left.toVector2())
    this.leftTopLeft.position = status.mapping(status.viewArea.leftTopLeft.toVector2())

    this.centerBoxRotationX += 0.2
    this.centerBoxRotationY += 0.3
    this.centerBoxRotationZ += 0.5
    this.centerBox.rotation = Quaternion.fromRadianAndAxis(0, new Vector3(0, 1, 0))
      .rotateX(this.centerBoxRotationX)
      .rotateY(this.centerBoxRotationY)
      .rotateZ(this.centerBoxRotationZ)
  }
}