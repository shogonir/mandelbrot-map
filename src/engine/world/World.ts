import Layer from './layer/Layer'
import Camera from './camera/Camera'

export default class World {

  mainCamera: Camera

  layers: Layer[]

  constructor(mainCamera: Camera) {
    this.mainCamera = mainCamera
    this.layers = []
  }

  addLayer(layer: Layer) {
    this.layers.push(layer)
  }

  update() {
    this.mainCamera.draw(this.layers)
  }
}