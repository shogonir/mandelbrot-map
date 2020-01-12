import GameObject from '../../../../engine/object/GameObject'
import Quaternion from '../../../../common/Quaternion'
import Vector3 from '../../../../common/Vector3'
import Material from '../../../../engine/object/material/Material'
import TileObject from './TileObject'
import MMapStatus from '../../../status/MMapStatus'

export default class SheetObject extends GameObject {

  tiles: TileObject[]
  centerX: number

  constructor(
    position: Vector3,
    material: Material
  ) {
    const rotation = Quaternion.fromRadianAndVector3(0, new Vector3(0, 1, 0))
    const scale = Vector3.one().multiply(3.8)
    super(position, rotation, scale, material)

    this.tiles = []
    this.centerX = position.x
  }

  addChildTile(tileObject: TileObject) {
    this.tiles.push(tileObject)
    this.addChild(tileObject)
  }

  mapUpdate(status: MMapStatus) {
    this.tiles.forEach(tile => tile.mapUpdate(status))
  }
}