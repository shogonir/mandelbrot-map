import { mat4 } from 'gl-matrix'

import vertexShaderSource from '../shader/SingleColorVertexShader.glsl'
import fragmentShaderSource from '../shader/SingleColorFragmentShader.glsl'
import Geometry from '../../geometry/Geometry'
import GameObject from '../../GameObject'
import Program from './Program'
import Camera from '../../../world/camera/Camera'
import Color from '../../../../common/Color'
import Numbers from '../../../../util/Numbers'

export default class SingleColorProgram implements Program {
  
  gl: WebGL2RenderingContext
  geometry: Geometry

  vertexShader: WebGLShader
  fragmentShader: WebGLShader
  program: WebGLProgram

  color: Color | undefined

  setup(gl: WebGL2RenderingContext, geometry: Geometry) {
    this.gl = gl
    this.geometry = geometry
    this.color = undefined
    this.setupProgram()
    this.setupGeometry(geometry)
  }

  setupProgram() {
    const mayBeVertexShader: WebGLShader | null = this.gl.createShader(this.gl.VERTEX_SHADER)
    if (mayBeVertexShader === null) {
      console.error('[ERROR] SingleColorProgram.setupProgram() could not create vertex shader')
      return
    }
    this.vertexShader = mayBeVertexShader
    this.gl.shaderSource(this.vertexShader, vertexShaderSource)
    this.gl.compileShader(this.vertexShader)

    const vertexShaderCompileStatus = this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)
    if (!vertexShaderCompileStatus) {
      const info = this.gl.getShaderInfoLog(this.vertexShader)
      console.warn(info)
      return
    }

    const mayBeFragmentShader: WebGLShader | null = this.gl.createShader(this.gl.FRAGMENT_SHADER)
    if (mayBeFragmentShader === null) {
      console.error('[ERROR] SingleColorProgram.setupProgram() could not create fragment shader')
      return
    }
    this.fragmentShader = mayBeFragmentShader
    this.gl.shaderSource(this.fragmentShader, fragmentShaderSource)
    this.gl.compileShader(this.fragmentShader)

    const fragmentShaderCompileStatus = this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS)
    if (!fragmentShaderCompileStatus) {
      const info = this.gl.getShaderInfoLog(this.fragmentShader)
      console.warn(info)
    }

    const mayBeProgram = this.gl.createProgram()
    if (mayBeProgram === null) {
      console.error('[ERROR] SingleColorProgram.setupProgram() could not create program')
      return
    }
    this.program = mayBeProgram
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
    this.color = color

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
    const rotation = mat4.create()
    const translation = mat4.create()
    const model = mat4.create()

    const updateModel = (object: GameObject) => {
      mat4.scale(scale, scale, object.scale.toArray())
      mat4.multiply(rotation, rotation, object.rotation.toMat4())
      const localTranslation = mat4.create()
      mat4.translate(localTranslation, localTranslation, object.position.toArray())
      mat4.multiply(translation, translation, localTranslation)
    }

    updateModel(gameObject)
    let parent = gameObject.parent
    while (parent !== undefined) {
      updateModel(parent)
      parent = parent.parent
    }

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
    if (this.color !== undefined) {
      this.setColor(this.color)
    }

    this.gl.drawElements(this.gl.TRIANGLES, this.geometry.indices.length, this.gl.UNSIGNED_SHORT, 0)
  }
}