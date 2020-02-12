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
    const scale = Vector3.one().multiply(0.5)
    super(position, rotation, scale, material)

    this.material = material
    this.tileNumber = tileNumber
    this.getTexture = getTexture
    this.isSetTexture = false
  }

  mapUpdate(status: MMapStatus) {
    const side = TileNumber.calculateSide(status.zoomAsInt) * 0.1
    this.scale = new Vector3(side, side, 1)
    this.position = status.mapping(this.tileNumber.center())

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