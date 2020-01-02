import Vector3 from '../../common/Vector3'
import Quaternion from '../../common/Quaternion'
import Material from './material/Material'
import Geometry from './geometry/Geometry'
import GameObjectLifeCycle from './GameObjectLifeCycle'
import Camera from '../world/camera/Camera'

export default class GameObject {

  position: Vector3
  rotation: Quaternion
  scale: Vector3

  material: Material
  geometry: Geometry

  lifeCycle: GameObjectLifeCycle

  constructor(
    position: Vector3,
    rotation: Quaternion,
    scale: Vector3,
    material: Material,
    geometry: Geometry,
    lifeCycle: GameObjectLifeCycle
  ) {
    this.position = position
    this.rotation = rotation
    this.scale = scale
    this.material = material
    this.geometry = geometry
    this.lifeCycle = lifeCycle
  }

  update(camera: Camera) {
    this.material.update(this, camera)
    this.lifeCycle.onUpdate()
  }

  draw() {
    this.material.draw()
  }
}