import GameObject from '../../../../engine/object/GameObject'
import Quaternion from '../../../../common/Quaternion'
import Vector3 from '../../../../common/Vector3'
import Material from '../../../../engine/object/material/Material'
import TileObject from './TileObject'
import MMapStatus from '../../../status/MMapStatus'

export default class SheetObject extends GameObject {

  index: number
  tiles: TileObject[]
  tileMaterial: Material

  constructor(
    position: Vector3,
    material: Material,
    tileMaterial: Material
  ) {
    const rotation = Quaternion.fromRadianAndVector3(0, new Vector3(0, 1, 0))
    const scale = Vector3.one().multiply(3.8)
    super(position, rotation, scale, material)

    this.tiles = []
    this.tileMaterial = tileMaterial
  }

  mapUpdate(status: MMapStatus) {
    this.tiles = []
    const tileNumbers = status.viewArea.viewTiles.sheetMap[this.index]
    if (tileNumbers === undefined) {
      return
    }
    
    status.viewArea.viewTiles.sheetMap[this.index].forEach(tile => {
      this.tiles.push(new TileObject(status.mapping(tile.center()), this.tileMaterial))
    })
    this.children = this.tiles
    // this.tiles.forEach(tile => tile.mapUpdate(status))
  }
}