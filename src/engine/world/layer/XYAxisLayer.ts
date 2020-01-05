import Layer from './Layer'
import GameObject from '../../object/GameObject'
import Vector3 from '../../../common/Vector3'
import Quaternion from '../../../common/Quaternion'
import SingleColorMaterial from '../../object/material/SingleColorMaterial'
import PlaneGeometry from '../../object/geometry/PlaneGeometry'
import Color from '../../../common/Color'
import LifeCycleRotateY from '../../object/lifecycle/LifeCycleRotateY'

export default class XYAxisLayer implements Layer {

  gameObjects: GameObject[]

  xAxis: GameObject
  yAxis: GameObject

  constructor(gl: WebGL2RenderingContext) {
    this.gameObjects = []

    const plane = new PlaneGeometry(1.0)
    const xAxisBlackMaterial = new SingleColorMaterial(gl, plane, Color.black())
    const lifeCycle = new LifeCycleRotateY()
    this.xAxis = new GameObject(
      Vector3.zero(),
      new Quaternion(1, 1, 0, 0),
      new Vector3(0, 1, 0),
      xAxisBlackMaterial,
      lifeCycle
    )
    this.gameObjects.push(this.xAxis)
  }
}