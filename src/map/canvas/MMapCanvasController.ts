import World from '../../engine/world/World'
import PerspectiveCamera from '../../engine/world/camera/PerspectiveCamera'
import Vector3 from '../../common/Vector3'
import MMapStatus from '../status/MMapStatus'
import XYAxisLayer from './layer/axis/XYAxisLayer'
import CanvasUtils from '../../util/CanvasUtils'
import EngineMath from '../../engine/common/EngineMath'
import TileSheetLayer from './layer/tile/TileSheetLayer'
import ViewAreaLayer from './layer/viewarea/ViewAreaLayer'
import MMapUtils from '../util/MMapUtils'
import Color from '../../common/Color'

export default class MMapCanvasController {

  canvas: HTMLCanvasElement
  gl: WebGL2RenderingContext

  previousZoom: number

  viewAreaLayer: ViewAreaLayer
  xyAxisLayer: XYAxisLayer
  tileSheetLayer: TileSheetLayer

  world: World

  constructor(canvas: HTMLCanvasElement, status: MMapStatus) {
    this.canvas = canvas
    this.previousZoom = -1
    this.gl = this.canvas.getContext('webgl2')
    // this.gl.enable(this.gl.DEPTH_TEST);
    // this.gl.enable(this.gl.CULL_FACE);

    const cameraPosition = status.polar.toVector3()
    const ptu = CanvasUtils.calculatePixelToUnit(status.zoom)
    const toHalf = 0.5
    const halfVerticalFovRadian = Math.atan(status.clientHeight * ptu * toHalf / cameraPosition.z)

    const mainCamera = new PerspectiveCamera(
      this.gl,
      cameraPosition,
      new Vector3(0, 0, MMapUtils.SqhereRadius),
      new Vector3(0, 1, 0),
      halfVerticalFovRadian * 2 * EngineMath.rad2Deg,
      1.0,
      0.1,
      100,
      Color.midnightBlue()
    )

    this.viewAreaLayer = new ViewAreaLayer(this.gl, status)
    this.xyAxisLayer = new XYAxisLayer(this.gl, status)
    this.tileSheetLayer = new TileSheetLayer(this.gl, status)

    this.world = new World(mainCamera)
    this.world.addLayer(this.tileSheetLayer)
    this.world.addLayer(this.xyAxisLayer)
    this.world.addLayer(this.viewAreaLayer)

    this.updateCamera(status)

    this.world.update()
  }

  update(status: MMapStatus) {
    this.updateCamera(status)

    this.viewAreaLayer.update(status)
    this.xyAxisLayer.update(status)
    this.tileSheetLayer.update(status)
    
    this.world.update()
  }

  updateCamera(status: MMapStatus) {
    const camera = this.world.mainCamera

    camera.position = status.cameraPosition.clone()
    camera.upVector = status.cameraUp.clone()
    camera.verticalFov = status.verticalFov
    
    camera.update()
  }
}