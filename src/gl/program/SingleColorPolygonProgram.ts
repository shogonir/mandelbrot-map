import vertexShaderSource from '../shader/VertexShader.glsl'
import fragmentShaderSource from '../shader/FragmentShader.glsl'
import Color from '../../common/Color'
import Numbers from '../../util/Numbers'

export default class SingleColorPolygonProgram {

  gl: WebGL2RenderingContext
  program: WebGLProgram

  numberVertices: number

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
  }

  setup() {
    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
    this.gl.shaderSource(vertexShader, vertexShaderSource)
    this.gl.compileShader(vertexShader)

    const vertexShaderCompileStatus = this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)
    if (!vertexShaderCompileStatus) {
      const info = this.gl.getShaderInfoLog(vertexShader)
      console.warn(info)
      return
    }

    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
    this.gl.shaderSource(fragmentShader, fragmentShaderSource)
    this.gl.compileShader(fragmentShader)

    const fragmentShaderCompileStatus = this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)
    if (!fragmentShaderCompileStatus) {
      const info = this.gl.getShaderInfoLog(fragmentShader)
      console.warn(info)
    }

    this.program = this.gl.createProgram()
    this.gl.attachShader(this.program, vertexShader)
    this.gl.attachShader(this.program, fragmentShader)
    this.gl.linkProgram(this.program)

    const linkStatus = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)
    if (!linkStatus) {
      const info = this.gl.getProgramInfoLog(this.program)
      console.warn(info)
    }

    this.gl.useProgram(this.program)
  }

  setAttribute(color: Color, vertices: number[]) {
    if (vertices.length % 3 !== 0) {
      return
    }

    this.numberVertices = vertices.length / 3

    const vertexBuffer = this.gl.createBuffer()
    const colorBuffer = this.gl.createBuffer()

    const vertexAttribLocation = this.gl.getAttribLocation(this.program, 'vertexPosition')
    const colorAttribLocation = this.gl.getAttribLocation(this.program, 'color')

    const VERTEX_SIZE = 3
    const COLOR_SIZE = 4

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.enableVertexAttribArray(vertexAttribLocation)
    this.gl.vertexAttribPointer(vertexAttribLocation, VERTEX_SIZE, this.gl.FLOAT, false, 0, 0)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
    this.gl.enableVertexAttribArray(colorAttribLocation)
    this.gl.vertexAttribPointer(colorAttribLocation, COLOR_SIZE, this.gl.FLOAT, false, 0, 0)

    const typedVertices = new Float32Array(vertices)

    const colors: number[] = []
    Numbers.range(0, this.numberVertices)
      .forEach(() => {
        colors.push(...[color.r, color.g, color.b, color.a])
      })
    const typedColors = new Float32Array(colors)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, typedVertices, this.gl.STATIC_DRAW)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, typedColors, this.gl.STATIC_DRAW)
  }

  draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numberVertices)

    this.gl.flush()
  }
}