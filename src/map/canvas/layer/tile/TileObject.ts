import GameObject from '../../../../engine/object/GameObject'
import Vector3 from '../../../../common/Vector3'
import Material from '../../../../engine/object/material/Material'
import Quaternion from '../../../../common/Quaternion'
import MMapStatus from '../../../status/MMapStatus'
import TileNumber from '../../../../tile/TileNumber'

export default class TileObject extends GameObject {

  zoomAsInt: number

  constructor(position: Vector3, material: Material) {
    const rotation = Quaternion.fromRadianAndVector3(0, new Vector3(0, 1, 0))
    const scale = Vector3.one().multiply(0.5)
    super(position, rotation, scale, material)
  }

  mapUpdate(status: MMapStatus) {
    const side = TileNumber.calculateSide(status.zoomAsInt)
    this.scale = new Vector3(side, side, 1)
    this.zoomAsInt = status.zoomAsInt
  }
}