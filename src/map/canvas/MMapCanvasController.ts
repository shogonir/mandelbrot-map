import SingleColorPolygonProgram from '../../gl/program/SingleColorPolygonProgram'
import World from '../../engine/world/World'
import PerspectiveCamera from '../../engine/world/camera/PerspectiveCamera'
import Vector3 from '../../common/Vector3'
import MMapStatus from '../status/MMapStatus'
import XYAxisLayer from './layer/XYAxisLayer'
import CanvasUtils from '../../util/CanvasUtils'
import EngineMath from '../../engine/common/EngineMath'

export default class MMapCanvasController {

  canvas: HTMLCanvasElement
  gl: WebGL2RenderingContext

  initialized: boolean

  polygonProgram: SingleColorPolygonProgram

  constructor(canvas: HTMLCanvasElement, status: MMapStatus) {
    this.initialized = false
    this.canvas = canvas
    this.gl = this.canvas.getContext('webgl2')
    this.gl.enable(this.gl.DEPTH_TEST);
    // this.gl.enable(this.gl.CULL_FACE);

    const cameraPosition = new Vector3(0, 0, 10)
    const ptu = CanvasUtils.calculatePixelToUnit(status.zoom)
    const toHalf = 0.5
    const halfVerticalFovRadian = Math.atan(status.clientHeight * ptu * toHalf / cameraPosition.z)

    const mainCamera = new PerspectiveCamera(
      cameraPosition,
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0),
      halfVerticalFovRadian * 2 * EngineMath.rad2Deg,
      1.0,
      0.1,
      100
    )

    const xyAxisLayer = new XYAxisLayer(this.gl, status)

    const world = new World(mainCamera)
    world.addLayer(xyAxisLayer)

    world.update()
    // setInterval(() => {
    //   world.update()
    // }, 16)
  }
}