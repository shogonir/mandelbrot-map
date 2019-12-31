import { mat4 } from 'gl-matrix'

import vertexShaderSource from '../shader/VertexShader.glsl'
import fragmentShaderSource from '../shader/FragmentShader.glsl'
import Color from '../../common/Color'
import Numbers from '../../util/Numbers'

export default class SingleColorPolygonProgram {

  gl: WebGL2RenderingContext
  program: WebGLProgram

  numberIndices: number

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

  setAttribute(color: Color, vertices: number[], indices: number[]) {
    if (indices.length % 3 !== 0) {
      console.log('no')
      return
    }

    const scale = mat4.create()
    mat4.scale(scale, scale, [1, 1, 1]);
    const rotation = mat4.create();
    mat4.rotateZ(rotation, rotation, Math.PI / 8);
    const translation = mat4.create();
    mat4.translate(translation, translation, [1, 0, -1]);
    const model = mat4.create();
    mat4.multiply(model, model, translation);
    mat4.multiply(model, model, rotation);
    mat4.multiply(model, model, scale);

    const cameraPosition = [0, 60, 90];
    const lookAtPosition = [0, 0, 0];
    const upDirection    = [0, 1, 0];
    const view  = mat4.create();
    mat4.lookAt(view, cameraPosition, lookAtPosition, upDirection);

    const left   = -40;
    const right  = 40;
    const top    = 40;
    const bottom = -40;
    const near   = 30;    // nearとfarは「Z座標」ではなく「距離」を表す。
    const far    = 150;  // つまり、0 < near < far を満たす値を設定する。
    const projection = mat4.create();
    mat4.frustum(projection, left, right, bottom, top, near, far);

    const modelLocation      = this.gl.getUniformLocation(this.program, 'model');
    const viewLocation       = this.gl.getUniformLocation(this.program, 'view');
    const projectionLocation = this.gl.getUniformLocation(this.program, 'projection');
    this.gl.uniformMatrix4fv(modelLocation, false, model);
    this.gl.uniformMatrix4fv(viewLocation, false, view);
    this.gl.uniformMatrix4fv(projectionLocation, false, projection);

    this.numberIndices = indices.length

    const vertexBuffer = this.gl.createBuffer()
    const indexBuffer = this.gl.createBuffer()
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
    const typedIndices = new Uint16Array(indices)

    const colors: number[] = []
    Numbers.range(0, vertices.length)
      .forEach(() => {
        colors.push(...[color.r, color.g, color.b, color.a])
      })
    const typedColors = new Float32Array(colors)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, typedVertices, this.gl.STATIC_DRAW)

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, typedIndices, this.gl.STATIC_DRAW);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, typedColors, this.gl.STATIC_DRAW)
  }

  draw() {
    this.gl.drawElements(this.gl.TRIANGLES, this.numberIndices, this.gl.UNSIGNED_SHORT, 0)

    this.gl.flush()
  }
}