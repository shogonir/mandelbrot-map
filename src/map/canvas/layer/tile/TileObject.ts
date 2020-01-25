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

  constructor(
    position: Vector3,
    material: CanvasTextureMaterial,
    tileNumber: TileNumber,
    getTexture: (tileName: string) => ImageBitmap | undefined
  ) {
    const rotation = Quaternion.fromRadianAndAxis(Math.PI, new Vector3(1, 0, 0))
    const scale = Vector3.one().multiply(0.5)
    super(position, rotation, scale, material)

    this.material = material
    this.tileNumber = tileNumber
    this.getTexture = getTexture
  }

  mapUpdate(status: MMapStatus) {
    const side = TileNumber.calculateSide(status.zoomAsInt)
    this.scale = new Vector3(side, side, 1)

    const mayBeTexture = this.getTexture(this.tileNumber.toString())
    if (mayBeTexture === undefined) {
      return
    }
    const texture: ImageBitmap = mayBeTexture
    this.material.setTexture(texture)
  }
}