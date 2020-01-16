import GameObject from '../../../../engine/object/GameObject'
import Quaternion from '../../../../common/Quaternion'
import Vector3 from '../../../../common/Vector3'
import Material from '../../../../engine/object/material/Material'
import TileObject from './TileObject'
import MMapStatus from '../../../status/MMapStatus'
import PlaneGeometry from '../../../../engine/object/geometry/PlaneGeometry'
import SingleColorMaterial from '../../../../engine/object/material/SingleColorMaterial'
import Color from '../../../../common/Color'

export default class SheetObject extends GameObject {

  gl: WebGL2RenderingContext
  tileMaterials: Material[]

  index: number
  tiles: TileObject[]

  constructor(
    gl: WebGL2RenderingContext,
    position: Vector3,
    material: Material,
    tileMaterials: Material[],
    index: number
  ) {
    const rotation = Quaternion.fromRadianAndVector3(0, new Vector3(0, 1, 0))
    const scale = Vector3.one().multiply(3.8)
    super(position, rotation, scale, material)

    this.gl = gl
    this.tileMaterials = tileMaterials
    this.index = index
    this.tiles = []
  }

  mapUpdate(status: MMapStatus) {
    const tileNumbers = status.viewArea.viewTiles.sheetMap[this.index]
    if (tileNumbers === undefined) {
      return
    }

    this.tiles = status.viewArea.viewTiles.sheetMap[this.index].map((tile, index) => {
      const tileCenter = tile.center()
      const position = status.mapping(tileCenter)
      const plane = new PlaneGeometry(1.0)
      if (index >= this.tileMaterials.length) {
        const plane = new PlaneGeometry(1.0)
        const material = new SingleColorMaterial(this.gl, plane, Color.emeraldGreen())
        this.tileMaterials.push(material)
      }
      const tileObject = new TileObject(position, this.tileMaterials[index])
      tileObject.mapUpdate(status)
      return tileObject
    })
    this.children = this.tiles
  }
}