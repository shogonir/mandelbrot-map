import vertexShaderSource from '../../gl/shader/VertexShader.glsl'
import fragmentShaderSource from '../../gl/shader/FragmentShader.glsl'
import SingleColorPolygonProgram from '../../gl/program/SingleColorPolygonProgram'
import Color from '../../common/Color'

export default class MMapCanvasController {

  canvas: HTMLCanvasElement
  gl: WebGL2RenderingContext

  initialized: boolean

  polygonProgram: SingleColorPolygonProgram

  constructor(canvas: HTMLCanvasElement) {
    this.initialized = false
    this.canvas = canvas
    this.gl = this.canvas.getContext('webgl2')

    this.setupProgram()
  }

  setupProgram() {
    const axisWidth = 0.001

    // x-axis
    this.polygonProgram = new SingleColorPolygonProgram(this.gl)
    this.polygonProgram.setup()
    this.polygonProgram.setAttribute(
      new Color(0, 0, 0, 1.0),
      [
        -1, axisWidth, 0.0,
        -1, -axisWidth, 0.0,
        1, axisWidth, 0.0,
        -1, -axisWidth, 0.0,
        1, -axisWidth, 0.0,
        1, axisWidth, 0.0
      ]
    )
    this.polygonProgram.draw()

    // y-axis
    this.polygonProgram = new SingleColorPolygonProgram(this.gl)
    this.polygonProgram.setup()
    this.polygonProgram.setAttribute(
      new Color(0, 0, 0, 1.0),
      [
        -axisWidth, 1, 0.0,
        -axisWidth, -1, 0.0,
        axisWidth, 1, 0.0,
        -axisWidth, -1, 0.0,
        axisWidth, -1, 0.0,
        axisWidth, 1, 0.0
      ]
    )
    this.polygonProgram.draw()
  }
}