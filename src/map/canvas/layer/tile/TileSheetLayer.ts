import Layer from '../../../../engine/world/layer/Layer'
import GameObject from '../../../../engine/object/GameObject'
import MMapStatus from '../../../status/MMapStatus'
import Vector3 from '../../../../common/Vector3'
import SingleColorMaterial from '../../../../engine/object/material/SingleColorMaterial'
import Color from '../../../../common/Color'
import SheetObject from './SheetObject'
import Vector2 from '../../../../common/Vector2'
import Numbers from '../../../../util/Numbers'
import Material from '../../../../engine/object/material/Material'
import NumberRange from '../../../../common/NumberRange'
import Ray3 from '../../../../common/Ray3'
import MMap from '../../../MMap'
import NoneGeometry from '../../../../engine/object/geometry/NoneGeometry'

export default class TileSheetLayer implements Layer {

  gl: WebGL2RenderingContext

  gameObjects: GameObject[]

  sheetMap: { [sheetIndex: number]: SheetObject }

  sharedMaterial: Material

  getTexture: (tileName: string) => ImageBitmap | undefined

  constructor(
    gl: WebGL2RenderingContext,
    status: MMapStatus,
    getTexture: (tileName: string) => ImageBitmap | undefined
  ) {
    this.gl = gl
    this.getTexture = getTexture

    this.gameObjects = []
    this.sheetMap = []

    const noneGeometry = new NoneGeometry()
    this.sharedMaterial = new SingleColorMaterial(gl, noneGeometry, Color.blue())

    this.update(status)
  }

  update(status: MMapStatus) {
    const rangeX = this.calculateRangeX(status)
    const minXMulti4 = 4 * Math.floor(rangeX.min / 4)
    const maxXMulti4 = 4 * Math.ceil(rangeX.max / 4)
    const xsMulti4 = Numbers.range(minXMulti4, maxXMulti4, 4, true)
    this.updatePosition(status, xsMulti4)
    this.gameObjects = Object.values(this.sheetMap)
  }

  private calculateRangeX(status: MMapStatus): NumberRange {
    const xs: number[] = []
    const points = status.viewArea.points
    Numbers.range(0, points.length - 1).forEach((index: number) => {
      const mayBeRangeX = this.calculateLineSegmentRangeX(points[index], points[index + 1])
      if (mayBeRangeX === undefined) {
        return
      }
      const rangeX = mayBeRangeX
      xs.push(rangeX.min)
      xs.push(rangeX.max)
    })
    const mayBeRangeX = this.calculateLineSegmentRangeX(points[points.length - 1], points[0])
    if (mayBeRangeX !== undefined) {
      const rangeX = mayBeRangeX
      xs.push(rangeX.min)
      xs.push(rangeX.max)
    }
    if (xs.length === 0) {
      return new NumberRange(0, 0)
    }
    return new NumberRange(Math.min(...xs), Math.max(...xs))
  }

  private calculateLineSegmentRangeX(s: Vector3, t: Vector3): NumberRange | undefined {
    const xs: number[] = []
    if (MMap.MinY <= s.y && s.y <= MMap.MaxY) {
      xs.push(s.x)
    }
    if (MMap.MinY <= t.y && t.y <= MMap.MaxY) {
      xs.push(t.x)
    }
    if ((s.y <= MMap.MinY && t.y >= MMap.MinY) || (s.y >= MMap.MinY && t.y <= MMap.MinY)) {
      const ray = new Ray3(s, t.subtract(s))
      const mayBeIntersection = ray.intersectsWithPlaneYEqualsParameter(MMap.MinY)
      if (mayBeIntersection !== undefined) {
        xs.push(mayBeIntersection.x)
      }
    }
    if ((s.y <= MMap.MaxY && t.y >= MMap.MaxY) || (s.y >= MMap.MaxY && t.y <= MMap.MaxY)) {
      const ray = new Ray3(s, t.subtract(s))
      const mayBeIntersection = ray.intersectsWithPlaneYEqualsParameter(MMap.MaxY)
      if (mayBeIntersection !== undefined) {
        xs.push(mayBeIntersection.x)
      }
    }
    if (xs.length === 0) {
      return undefined
    }
    return new NumberRange(Math.min(...xs), Math.max(...xs))
  }

  private updatePosition(status: MMapStatus, xsMulti4: number[]) {
    const targetSheetIndices: number[] = xsMulti4.map(x => Math.round(x / 4))
    const currentSheetIndices: number[] = Object.keys(this.sheetMap).map(index => parseInt(index, 10))
    
    currentSheetIndices.forEach(sheetIndex => {
      const sheet = this.sheetMap[sheetIndex]
      sheet.mapUpdate(status)
    })

    currentSheetIndices.forEach(sheetIndex => {
      if (targetSheetIndices.includes(sheetIndex) === false) {
        delete this.sheetMap[sheetIndex]
      }
    })
    
    targetSheetIndices.forEach(sheetIndex => {
      if (currentSheetIndices.includes(sheetIndex) === false) {
        const xMulti4 = Math.round(sheetIndex * 4)
        const position = status.mapping(new Vector2(xMulti4, 0))
        const sheet = new SheetObject(this.gl, position, this.sharedMaterial, sheetIndex, this.getTexture)
        sheet.mapUpdate(status)
        this.sheetMap[sheetIndex] = sheet
      }
    })
  }
}