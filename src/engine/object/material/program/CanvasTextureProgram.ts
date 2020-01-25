import { mat4 } from 'gl-matrix'

import vertexShaderSource from '../shader/CanvasTextureVertexShader.glsl'
import fragmentShaderSource from '../shader/CanvasTextureFragmentShader.glsl'

import Program from './Program'
import Geometry from '../../geometry/Geometry'
import GameObject from '../../GameObject'
import Camera from '../../../world/camera/Camera'

export default class CanvasTextureProgram implements Program {

  gl: WebGL2RenderingContext
  geometry: Geometry

  vertexShader: WebGLShader
  fragmentShader: WebGLShader
  program: WebGLProgram

  imageBitmap: ImageBitmap
  texture: WebGLTexture | null

  setup(gl: WebGL2RenderingContext, geometry: Geometry) {
    this.gl = gl
    this.geometry = geometry
    this.texture = gl.createTexture()
    this.setupProgram()
    this.setupGeometry(geometry)
    this.initTexture()
  }

  setupProgram() {
    const mayBeVertexShader: WebGLShader | null = this.gl.createShader(this.gl.VERTEX_SHADER)
    if (mayBeVertexShader === null) {
      console.error('[ERROR] CanvasTextureProgram.setupProgram() could not create vertex shader')
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
      console.error('[ERROR] CanvasTextureProgram.setupProgram() could not create fragment shader')
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
      console.error('[ERROR] CanvasTextureProgram.setupProgram() could not create program')
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
    const typedVertices = new Float32Array(geometry.vertices)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, typedVertices, this.gl.STATIC_DRAW)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)

    const indexBuffer = this.gl.createBuffer()
    const typedIndices = new Uint16Array(geometry.indices)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, typedIndices, this.gl.STATIC_DRAW)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)

    const vertexAttribLocation = this.gl.getAttribLocation(this.program, 'vertexPosition')
    const textureAttribLocation  = this.gl.getAttribLocation(this.program, 'texCoord')

    const VERTEX_SIZE     = 3
    const TEXTURE_SIZE    = 2
    const STRIDE          = (VERTEX_SIZE + TEXTURE_SIZE) * Float32Array.BYTES_PER_ELEMENT
    const VERTEX_OFFSET   = 0
    const TEXTURE_OFFSET  = 3 * Float32Array.BYTES_PER_ELEMENT

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)

    this.gl.enableVertexAttribArray(vertexAttribLocation)
    this.gl.enableVertexAttribArray(textureAttribLocation)

    this.gl.vertexAttribPointer(vertexAttribLocation, VERTEX_SIZE, this.gl.FLOAT, false, STRIDE, VERTEX_OFFSET)
    this.gl.vertexAttribPointer(textureAttribLocation, TEXTURE_SIZE, this.gl.FLOAT, false, STRIDE, TEXTURE_OFFSET)

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  }

  setTexture(imageBitmap: ImageBitmap) {
    this.imageBitmap = imageBitmap

    this.gl.useProgram(this.program)

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, imageBitmap)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST)
    this.gl.generateMipmap(this.gl.TEXTURE_2D)
    // this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }

  initTexture() {
    const tileSize = 64
    const canvas = new OffscreenCanvas(tileSize, tileSize)
    const mayBeContext = canvas.getContext('2d')
    if (mayBeContext === null) {
      return
    }

    const context = mayBeContext
    context.fillStyle = '#FFFFFF'
    context.fillRect(0, 0, tileSize / 2, tileSize / 2)
    context.fillRect(tileSize / 2, tileSize / 2, tileSize / 2, tileSize / 2)
    context.fillStyle = '#DDDDDD'
    context.fillRect(0, tileSize / 2, tileSize / 2, tileSize / 2)
    context.fillRect(tileSize / 2, 0, tileSize / 2, tileSize / 2)

    const imageBitmap = canvas.transferToImageBitmap()
    this.setTexture(imageBitmap)
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
    this.setupGeometry(this.geometry)
    this.setTexture(this.imageBitmap)

    this.gl.drawElements(this.gl.TRIANGLES, this.geometry.indices.length, this.gl.UNSIGNED_SHORT, 0)

    this.gl.flush()
  }

  private static imageToPromise(image: HTMLImageElement): Promise<HTMLImageElement> {
    return new Promise(reject => {
      image.addEventListener('load', () => {
        reject(image)
      })
    })
  }
}