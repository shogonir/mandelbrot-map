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
import MMapTileRenderer from './render/MMapTileRenderer'

export default class MMapCanvasController {

  canvas: HTMLCanvasElement
  gl: WebGL2RenderingContext

  previousZoom: number

  viewAreaLayer: ViewAreaLayer
  xyAxisLayer: XYAxisLayer
  tileSheetLayer: TileSheetLayer

  tileRenderer: MMapTileRenderer

  world: World

  constructor(canvas: HTMLCanvasElement, status: MMapStatus) {
    this.canvas = canvas
    this.previousZoom = -1
    const mayBeGL: WebGL2RenderingContext | null = this.canvas.getContext('webgl2')
    if (mayBeGL === null) {
      console.error('[ERROR] MMapCanvasController.constructor() could not getContext()')
      return
    }
    this.gl = mayBeGL
    // this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);

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
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100,
      Color.gray()
    )

    this.tileRenderer = new MMapTileRenderer()

    const getTexture: (tileName: string) => ImageBitmap | undefined =  (tileName: string) => {
      return this.tileRenderer.tileCache[tileName]
    }

    this.viewAreaLayer = new ViewAreaLayer(this.gl, status)
    this.xyAxisLayer = new XYAxisLayer(this.gl, status)
    this.tileSheetLayer = new TileSheetLayer(this.gl, status, getTexture)

    this.world = new World(mainCamera)
    this.world.addLayer(this.tileSheetLayer)
    // this.world.addLayer(this.xyAxisLayer)
    // this.world.addLayer(this.viewAreaLayer)

    this.updateCamera(status)

    this.world.update()
  }

  update(status: MMapStatus) {
    this.updateCamera(status)

    this.viewAreaLayer.update(status)
    this.xyAxisLayer.update(status)
    this.tileSheetLayer.update(status)

    this.tileRenderer.update(status)
    
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