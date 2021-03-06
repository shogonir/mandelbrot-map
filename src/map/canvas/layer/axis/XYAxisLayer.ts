import Layer from '../../../../engine/world/layer/Layer'
import GameObject from '../../../../engine/object/GameObject'
import Vector3 from '../../../../common/Vector3'
import Quaternion from '../../../../common/Quaternion'
import PlaneGeometry from '../../../../engine/object/geometry/PlaneGeometry'
import SingleColorMaterial from '../../../../engine/object/material/SingleColorMaterial'
import Color from '../../../../common/Color'
import MMapStatus from '../../../status/MMapStatus'
import CanvasUtils from '../../../../util/CanvasUtils'
import Vector2 from '../../../../common/Vector2'
import MMap from '../../../MMap'

export default class XYAxisLayer implements Layer {

  gameObjects: GameObject[]

  xAxis: GameObject
  yAxis: GameObject

  constructor(gl: WebGL2RenderingContext, status: MMapStatus) {
    this.gameObjects = []

    const planeX = new PlaneGeometry(1.0)
    const blackMaterialX = new SingleColorMaterial(gl, planeX, Color.black())
    this.xAxis = new GameObject(
      Vector3.zero(),
      Quaternion.fromRadianAndAxis(0, new Vector3(0, 1, 0)),
      Vector3.zero(),
      blackMaterialX
    )

    const planeY = new PlaneGeometry(1.0)
    const blackMaterialY = new SingleColorMaterial(gl, planeY, Color.black())
    this.yAxis = new GameObject(
      Vector3.zero(),
      Quaternion.fromRadianAndAxis(0, new Vector3(0, 1, 0)),
      Vector3.zero(),
      blackMaterialY
    )

    this.update(status)

    this.gameObjects.push(this.xAxis)
    this.gameObjects.push(this.yAxis)
  }

  update(status: MMapStatus) {
    this.updatePosition(status)
    this.updateScale(status)
  }

  updatePosition(status: MMapStatus) {
    this.xAxis.position = status.mapping(Vector2.zero())
    this.yAxis.position = status.mapping(Vector2.zero())
  }

  updateScale(status: MMapStatus) {
    const ptu = CanvasUtils.calculatePixelToUnit(status.zoom)
    const heightAsUnit = MMap.MaxY - MMap.MinY
    const widthAsUnit = MMap.MaxX - MMap.MinX

    this.xAxis.scale.x = widthAsUnit
    this.xAxis.scale.y = ptu
    this.xAxis.scale.z = 1.0

    this.yAxis.scale.x = ptu
    this.yAxis.scale.y = heightAsUnit
    this.yAxis.scale.z = 1.0
  }
}