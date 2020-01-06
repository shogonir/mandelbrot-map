import Layer from '../../../engine/world/layer/Layer';
import GameObject from '../../../engine/object/GameObject';
import Vector3 from '../../../common/Vector3';
import Quaternion from '../../../common/Quaternion';
import PlaneGeometry from '../../../engine/object/geometry/PlaneGeometry';
import SingleColorMaterial from '../../../engine/object/material/SingleColorMaterial';
import Color from '../../../common/Color';
import MMapStatus from '../../status/MMapStatus';
import CanvasUtils from '../../../util/CanvasUtils';

export default class XYAxisLayer implements Layer {

  gameObjects: GameObject[]

  xAxis: GameObject
  yAxis: GameObject

  constructor(gl: WebGL2RenderingContext, status: MMapStatus) {
    this.gameObjects = []

    const heightAsUnit = status.maxUnit.y - status.minUnit.y
    const widthAsUnit = status.maxUnit.x - status.minUnit.x
    const ptu = CanvasUtils.calculatePixelToUnit(status.zoom)

    const planeX = new PlaneGeometry(1.0)
    const blackMaterialX = new SingleColorMaterial(gl, planeX, Color.black())
    this.xAxis = new GameObject(
      Vector3.zero(),
      Quaternion.fromRadianAndVector3(0, new Vector3(0, 1, 0)),
      new Vector3(widthAsUnit, ptu, 1.0),
      blackMaterialX
    )

    const planeY = new PlaneGeometry(1.0)
    const blackMaterialY = new SingleColorMaterial(gl, planeY, Color.black())
    this.yAxis = new GameObject(
      Vector3.zero(),
      Quaternion.fromRadianAndVector3(0, new Vector3(0, 1, 0)),
      new Vector3(ptu, heightAsUnit, 1.0),
      blackMaterialY
    )

    this.gameObjects.push(this.xAxis)
    this.gameObjects.push(this.yAxis)
  }
}