import World from '../../engine/world/World'
import PerspectiveCamera from '../../engine/world/camera/PerspectiveCamera'
import Vector3 from '../../common/Vector3'
import MMapStatus from '../status/MMapStatus'
import XYAxisLayer from './layer/axis/XYAxisLayer'
import CanvasUtils from '../../util/CanvasUtils'
import EngineMath from '../../engine/common/EngineMath'

export default class MMapCanvasController {

  canvas: HTMLCanvasElement
  gl: WebGL2RenderingContext

  previousZoom: number

  xyAxisLayer: XYAxisLayer

  world: World

  constructor(canvas: HTMLCanvasElement, status: MMapStatus) {
    this.canvas = canvas
    this.previousZoom = status.zoom
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

    this.xyAxisLayer = new XYAxisLayer(this.gl, status)

    this.world = new World(mainCamera)
    this.world.addLayer(this.xyAxisLayer)

    this.world.update()
    // setInterval(() => {
    //   world.update()
    // }, 16)
  }

  update(status: MMapStatus) {
    this.updateCameraIfNeeded(status)
    this.xyAxisLayer.update(status)
    this.world.update()
  }

  updateCameraIfNeeded(status: MMapStatus) {
    if (this.previousZoom === status.zoom) {
      return
    }

    const camera = this.world.mainCamera
    const ptu = CanvasUtils.calculatePixelToUnit(status.zoom)
    const toHalf = 0.5
    const halfVerticalFovRadian = Math.atan(status.clientHeight * ptu * toHalf / camera.position.z)
    camera.verticalFov = halfVerticalFovRadian * 2 * EngineMath.rad2Deg
    camera.update()
  }
}