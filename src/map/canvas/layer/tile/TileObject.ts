import GameObject from '../../../../engine/object/GameObject'
import Vector3 from '../../../../common/Vector3'
import Quaternion from '../../../../common/Quaternion'
import MMapStatus from '../../../status/MMapStatus'
import TileNumber from '../../../../tile/TileNumber'
import CanvasTextureMaterial from '../../../../engine/object/material/CanvasTextureMaterial'

export default class TileObject extends GameObject {

  material: CanvasTextureMaterial
  tileNumber: TileNumber
  getTexture: (tileName: string) => ImageBitmap | undefined

  isSetTexture: boolean

  constructor(
    position: Vector3,
    material: CanvasTextureMaterial,
    tileNumber: TileNumber,
    getTexture: (tileName: string) => ImageBitmap | undefined
  ) {
    const rotation = Quaternion.fromRadianAndAxis(0, new Vector3(0, 1, 0))
    const scale = Vector3.one()
    super(position, rotation, scale, material)

    this.material = material
    this.tileNumber = tileNumber
    this.getTexture = getTexture
    this.isSetTexture = false
  }

  mapUpdate(status: MMapStatus) {
    this.position = status.mapping(this.tileNumber.center())
    this.position = Vector3.zero()
    const bottomLeftPosition = status.mapping(this.tileNumber.bottomLeft()).subtract(this.position)
    const bottomRightPosition = status.mapping(this.tileNumber.bottomRight()).subtract(this.position)
    const topLeftPosition = status.mapping(this.tileNumber.topLeft()).subtract(this.position)
    const topRightPosition = status.mapping(this.tileNumber.topRight()).subtract(this.position)
    this.material.geometry.vertices = [
      topLeftPosition.x, topLeftPosition.y, topLeftPosition.z,
      0.0, 0.0,
      bottomLeftPosition.x, bottomLeftPosition.y, bottomLeftPosition.z,
      0.0, 1.0,
      topRightPosition.x, topRightPosition.y, topRightPosition.z,
      1.0, 0.0,
      bottomRightPosition.x, bottomRightPosition.y, bottomRightPosition.z,
      1.0, 1.0
    ]

    // this.rotation = MMapStatus.complexToRotationForTile(
    //   this.tileNumber.center()
    // ).multiply(
    //   MMapStatus.complexToRotationForTile(status.center).inverse()
    // )

    this.updateTextureIfNeeded()
  }

  private updateTextureIfNeeded() {
    if (this.isSetTexture) {
      return
    }

    const checked = this.tileNumber.toChecked()
    const mayBeTexture = this.getTexture(checked.toString())
    if (mayBeTexture === undefined) {
      return
    }

    const texture: ImageBitmap = mayBeTexture
    this.material.setTexture(texture)
  }
}