import vertexShaderSource from '../../shader/VertexShader.glsl'
import fragmentShaderSource from '../../shader/FragmentShader.glsl'

export default class MMapCanvasController {

  canvas: HTMLCanvasElement
  gl: WebGL2RenderingContext

  initialized: boolean

  constructor(canvas: HTMLCanvasElement) {
    this.initialized = false
    this.canvas = canvas
    this.gl = this.canvas.getContext('webgl2')

    this.setupProgram()
  }

  setupProgram() {
    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
    this.gl.shaderSource(vertexShader, vertexShaderSource)
    this.gl.compileShader(vertexShader)

    const vertexShaderCompileStatus = this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)
    if (!vertexShaderCompileStatus) {
      const info = this.gl.getShaderInfoLog(vertexShader)
      console.warn(info)
      return
    }

    // フラグメントシェーダについても同様にします。
    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
    this.gl.shaderSource(fragmentShader, fragmentShaderSource)
    this.gl.compileShader(fragmentShader)

    const fragmentShaderCompileStatus = this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)
    if (!fragmentShaderCompileStatus) {
      const info = this.gl.getShaderInfoLog(fragmentShader)
      console.warn(info)
    }

    const program = this.gl.createProgram()
    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)

    const linkStatus = this.gl.getProgramParameter(program, this.gl.LINK_STATUS)
    if (!linkStatus) {
      const info = this.gl.getProgramInfoLog(program)
      console.warn(info)
    }

    this.gl.useProgram(program)

    const vertexBuffer = this.gl.createBuffer()
    const colorBuffer = this.gl.createBuffer()

    const vertexAttribLocation = this.gl.getAttribLocation(program, 'vertexPosition')
    const colorAttribLocation = this.gl.getAttribLocation(program, 'color')

    const VERTEX_SIZE = 3 // vec3
    const COLOR_SIZE = 4 // vec4

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.enableVertexAttribArray(vertexAttribLocation)
    this.gl.vertexAttribPointer(vertexAttribLocation, VERTEX_SIZE, this.gl.FLOAT, false, 0, 0)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
    this.gl.enableVertexAttribArray(colorAttribLocation)
    this.gl.vertexAttribPointer(colorAttribLocation, COLOR_SIZE, this.gl.FLOAT, false, 0, 0)

    const vertices = new Float32Array([
      -0.5, 0.5, 0.0,
      -0.5, -0.5, 0.0,
      0.5, 0.5, 0.0,
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      0.5, 0.5, 0.0
    ])

    // 色情報。vec4で宣言してるのでrgbargbargba…と並べていきます。
    // すべて0.0〜1.0の範囲で指定します。
    // 頂点と同じ数だけ（今回は6つ）必要です。
    const colors = new Float32Array([
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0
    ])

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW)
    const VERTEX_NUMS = 6
    this.gl.drawArrays(this.gl.TRIANGLES, 0, VERTEX_NUMS)

    this.gl.flush()

    this.initialized = true
  }
}