import GameObject from '../../../../engine/object/GameObject'
import Quaternion from '../../../../common/Quaternion'
import Vector3 from '../../../../common/Vector3'
import Material from '../../../../engine/object/material/Material'
import TileObject from './TileObject'
import MMapStatus from '../../../status/MMapStatus'
import CanvasTextureMaterial from '../../../../engine/object/material/CanvasTextureMaterial'
import TexturePlaneGeometry from '../../../../engine/object/geometry/TexturePlaneGeometry'
import TileNumber from '../../../../tile/TileNumber'
import CanvasTextureProgram from '../../../../engine/object/material/program/CanvasTextureProgram'

export default class SheetObject extends GameObject {

  gl: WebGL2RenderingContext
  index: number

  getTexture: (tileName: string) => ImageBitmap | undefined

  tileMap: { [tileName: string]: TileObject }
  tileMaterialMap: { [tileName: string]: CanvasTextureMaterial }
  reusableMaterials: CanvasTextureMaterial[]

  constructor(
    gl: WebGL2RenderingContext,
    position: Vector3,
    material: Material,
    index: number,
    getTexture: (tileName: string) => ImageBitmap | undefined
  ) {
    const rotation = Quaternion.fromRadianAndAxis(0, new Vector3(0, 1, 0))
    const scale = Vector3.one().multiply(3.8)
    super(position, rotation, scale, material)

    this.gl = gl
    this.index = index
    this.getTexture = getTexture

    this.tileMap = {}
    this.tileMaterialMap = {}
    this.reusableMaterials = []
  }

  mapUpdate(status: MMapStatus) {
    const tileNumbers = status.viewArea.viewTiles.sheetMap[this.index]
    if (tileNumbers === undefined) {
      return
    }

    const targetTileNames = tileNumbers.mapToArray(tile => tile.toString())
    const currentTileNames = Object.keys(this.tileMap)

    currentTileNames.forEach(tileName => {
      const tileObject = this.tileMap[tileName]
      tileObject.mapUpdate(status)
    })

    currentTileNames.forEach(tileName => {
      if (targetTileNames.includes(tileName) === false) {
        const material = this.tileMap[tileName].material
        material.initTexture()
        this.reusableMaterials.push(material)
        delete this.tileMap[tileName]
      }
    })

    targetTileNames.forEach(tileName => {
      if (currentTileNames.includes(tileName) === false) {

        const mayBeTileNumber = TileNumber.fromString(tileName)
        if (mayBeTileNumber === undefined) {
          return
        }
        const tileNumber: TileNumber = mayBeTileNumber
        const position = status.mapping(tileNumber.center())
        const material = this.reusableMaterials.pop()
          || new CanvasTextureMaterial(this.gl, new TexturePlaneGeometry(1.0))
        const tileObject = new TileObject(position, material, tileNumber, this.getTexture)
        tileObject.mapUpdate(status)
        this.tileMap[tileName] = tileObject
        this.tileMaterialMap[tileName] = material
      }
    })

    this.children = Object.values(this.tileMap)
  }
}