import vertexShaderSource from '../../gl/shader/VertexShader.glsl'
import fragmentShaderSource from '../../gl/shader/FragmentShader.glsl'
import SingleColorPolygonProgram from '../../gl/program/SingleColorPolygonProgram'
import Color from '../../common/Color'
import World from '../../engine/world/World'
import PerspectiveCamera from '../../engine/world/camera/PerspectiveCamera'
import Vector3 from '../../common/Vector3'
import XYAxisLayer from '../../engine/world/layer/XYAxisLayer'

export default class MMapCanvasController {

  canvas: HTMLCanvasElement
  gl: WebGL2RenderingContext

  initialized: boolean

  polygonProgram: SingleColorPolygonProgram

  constructor(canvas: HTMLCanvasElement) {
    this.initialized = false
    this.canvas = canvas
    this.gl = this.canvas.getContext('webgl2')
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);

    const mainCamera = new PerspectiveCamera(
      new Vector3(0, 0, 40),
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0),
      90,
      1.0,
      20,
      100
    )

    const xyAxisLayer = new XYAxisLayer(this.gl)

    const world = new World(mainCamera)
    world.addLayer(xyAxisLayer)

    world.update()
  }
}