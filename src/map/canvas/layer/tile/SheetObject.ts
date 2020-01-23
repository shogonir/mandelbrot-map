import GameObject from '../../../../engine/object/GameObject'
import Quaternion from '../../../../common/Quaternion'
import Vector3 from '../../../../common/Vector3'
import Material from '../../../../engine/object/material/Material'
import TileObject from './TileObject'
import MMapStatus from '../../../status/MMapStatus'
import PlaneGeometry from '../../../../engine/object/geometry/PlaneGeometry'
import SingleColorMaterial from '../../../../engine/object/material/SingleColorMaterial'
import Color from '../../../../common/Color'
import CanvasTextureMaterial from '../../../../engine/object/material/CanvasTextureMaterial'
import TexturePlaneGeometry from '../../../../engine/object/geometry/TexturePlaneGeometry'
import TileNumber from '../../../../tile/TileNumber'

export default class SheetObject extends GameObject {

  gl: WebGL2RenderingContext
  tileMaterials: Material[]

  index: number
  tiles: TileObject[]

  canvas: HTMLCanvasElement

  constructor(
    gl: WebGL2RenderingContext,
    position: Vector3,
    material: Material,
    tileMaterials: Material[],
    index: number,
    canvas: HTMLCanvasElement
  ) {
    const rotation = Quaternion.fromRadianAndAxis(0, new Vector3(0, 1, 0))
    const scale = Vector3.one().multiply(3.8)
    super(position, rotation, scale, material)

    this.gl = gl
    this.tileMaterials = tileMaterials
    this.index = index
    this.tiles = []
    this.canvas = canvas
  }

  mapUpdate(status: MMapStatus) {
    const tileNumbers = status.viewArea.viewTiles.sheetMap[this.index]
    if (tileNumbers === undefined) {
      return
    }

    this.tiles = status.viewArea.viewTiles.sheetMap[this.index].mapToArray((tile: TileNumber, index: number) => {
      const tileCenter = tile.center()
      const position = status.mapping(tileCenter)
      if (index >= this.tileMaterials.length) {
        const texturePlane = new TexturePlaneGeometry(1.0)
        const material = new CanvasTextureMaterial(this.gl, texturePlane, this.canvas)
        this.tileMaterials.push(material)
      }
      const tileObject = new TileObject(position, this.tileMaterials[index])
      tileObject.mapUpdate(status)
      return tileObject
    })
    this.children = this.tiles
  }
}