import { mat4 } from 'gl-matrix'

import vertexShaderSource from '../shader/VertexShader.glsl'
import fragmentShaderSource from '../shader/FragmentShader.glsl'
import Geometry from '../../geometry/Geometry'
import GameObject from '../../GameObject'
import Program from './Program'
import Camera from '../../../world/camera/Camera'
import Color from '../../../../common/Color'
import Numbers from '../../../../util/Numbers'

export default class SingleColorProgram implements Program {
  
  gl: WebGL2RenderingContext
  geometry: Geometry

  vertexShader: WebGLShader | null
  fragmentShader: WebGLShader | null
  program: WebGLProgram | null

  setup(gl: WebGL2RenderingContext, geometry: Geometry) {
    this.gl = gl
    this.geometry = geometry
    this.setupProgram()
    this.setupGeometry(geometry)
  }

  setupProgram() {
    this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
    this.gl.shaderSource(this.vertexShader, vertexShaderSource)
    this.gl.compileShader(this.vertexShader)

    const vertexShaderCompileStatus = this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)
    if (!vertexShaderCompileStatus) {
      const info = this.gl.getShaderInfoLog(this.vertexShader)
      console.warn(info)
      return
    }

    this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
    this.gl.shaderSource(this.fragmentShader, fragmentShaderSource)
    this.gl.compileShader(this.fragmentShader)

    const fragmentShaderCompileStatus = this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS)
    if (!fragmentShaderCompileStatus) {
      const info = this.gl.getShaderInfoLog(this.fragmentShader)
      console.warn(info)
    }

    this.program = this.gl.createProgram()
    this.gl.attachShader(this.program, this.vertexShader)
    this.gl.attachShader(this.program, this.fragmentShader)
    this.gl.linkProgram(this.program)

    const linkStatus = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)
    if (!linkStatus) {
      const info = this.gl.getProgramInfoLog(this.program)
      console.warn(info)
    }

    this.gl.useProgram(this.program)
  }

  setupGeometry(geometry: Geometry) {
    this.gl.useProgram(this.program)
    
    const vertexBuffer = this.gl.createBuffer()
    const indexBuffer = this.gl.createBuffer()

    const vertexAttribLocation = this.gl.getAttribLocation(this.program, 'vertexPosition')

    const VERTEX_SIZE = 3

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.enableVertexAttribArray(vertexAttribLocation)
    this.gl.vertexAttribPointer(vertexAttribLocation, VERTEX_SIZE, this.gl.FLOAT, false, 0, 0)

    const typedVertices = new Float32Array(geometry.vertices)
    const typedIndices = new Uint16Array(geometry.indices)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, typedVertices, this.gl.STATIC_DRAW)

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, typedIndices, this.gl.STATIC_DRAW)
  }

  setColor(color: Color) {
    this.gl.useProgram(this.program)

    const colorBuffer = this.gl.createBuffer()
    const colorAttribLocation = this.gl.getAttribLocation(this.program, 'color')

    const COLOR_SIZE = 4

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
    this.gl.enableVertexAttribArray(colorAttribLocation)
    this.gl.vertexAttribPointer(colorAttribLocation, COLOR_SIZE, this.gl.FLOAT, false, 0, 0)

    const colors: number[] = []
    Numbers.range(0, this.geometry.vertices.length, 3)
      .forEach(() => {
        colors.push(...[color.r, color.g, color.b, color.a])
      })
    const typedColors = new Float32Array(colors)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, typedColors, this.gl.STATIC_DRAW)
  }

  update(gameObject: GameObject, camera: Camera) {
    this.updateUniform(gameObject, camera)
  }

  updateUniform(gameObject: GameObject, camera: Camera) {
    // model
    const scale = mat4.create()
    mat4.scale(scale, scale, gameObject.scale.toArray())

    const rotation = gameObject.rotation.toMat4()
    
    const translation = mat4.create()
    mat4.translate(translation, translation, gameObject.position.toArray())
    
    const model = mat4.create()
    mat4.multiply(model, model, translation)
    mat4.multiply(model, model, rotation)
    mat4.multiply(model, model, scale)

    // view
    const view  = mat4.create()
    mat4.lookAt(view, camera.position.toArray(), camera.target.toArray(), camera.upVector.toArray())

    // projection
    const projection = camera.projectionMatrix

    this.gl.useProgram(this.program)
    const modelLocation      = this.gl.getUniformLocation(this.program, 'model')
    const viewLocation       = this.gl.getUniformLocation(this.program, 'view')
    const projectionLocation = this.gl.getUniformLocation(this.program, 'projection')
    this.gl.uniformMatrix4fv(modelLocation, false, model)
    this.gl.uniformMatrix4fv(viewLocation, false, view)
    this.gl.uniformMatrix4fv(projectionLocation, false, projection)
  }

  draw() {
    this.gl.drawElements(this.gl.TRIANGLES, this.geometry.indices.length, this.gl.UNSIGNED_SHORT, 0)

    this.gl.flush()
  }
}