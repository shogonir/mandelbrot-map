import Vector3 from '../../common/Vector3'
import Quaternion from '../../common/Quaternion'
import Material from './material/Material'
import Geometry from './geometry/Geometry'
import Camera from '../world/camera/Camera'

export default class GameObject {

  position: Vector3
  rotation: Quaternion
  scale: Vector3

  material: Material
  geometry: Geometry

  parent: GameObject | undefined
  children: GameObject[]

  constructor(
    position: Vector3,
    rotation: Quaternion,
    scale: Vector3,
    material: Material
  ) {
    this.position = position
    this.rotation = rotation
    this.scale = scale
    this.material = material
    this.geometry = material.geometry
    this.parent = undefined
    this.children = []
  }

  update(camera: Camera) {
    this.material.update(this, camera)
    this.children.forEach(child => child.update(camera))
  }

  draw() {
    this.material.draw()
    this.children.forEach(child => child.draw())
  }

  addChild(child: GameObject) {
    if (child.parent !== undefined) {
      return
    }
    this.children.push(child)
    child.parent = this
  }
}