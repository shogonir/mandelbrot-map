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
import MandelbrotSet from '../../../../mandelbrot/MandelbrotSet'
import TileNumber from '../../../../tile/TileNumber'

export default class TileSheetLayer implements Layer {

  gl: WebGL2RenderingContext

  gameObjects: GameObject[]

  sheets: SheetObject[]

  sharedMaterial: Material
  tileMaterialsMap: { [sheetIndex: number]: Material[]}

  renderedCanvas: HTMLCanvasElement

  constructor(gl: WebGL2RenderingContext, status: MMapStatus) {
    this.gl = gl
    this.gameObjects = []
    this.sheets = []

    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    document.body.appendChild(canvas)
    canvas.setAttribute('id', 'drawer')
    const mayBeTile: TileNumber | undefined = TileNumber.create(0, 0, 0)
    if (mayBeTile === undefined) {
      console.error('[ERROR] TileSheetLayer.constructor() could not create tile')
      return
    }

    const tile: TileNumber = mayBeTile
    MandelbrotSet.draw('drawer', tile, 5)
    this.renderedCanvas = canvas

    const noneGeometry = new NoneGeometry()
    this.sharedMaterial = new SingleColorMaterial(gl, noneGeometry, Color.blue())
    this.tileMaterialsMap = {}

    this.update(status)
  }

  update(status: MMapStatus) {
    const rangeX = this.calculateRangeX(status)
    const minXMulti4 = 4 * Math.floor(rangeX.min / 4)
    const maxXMulti4 = 4 * Math.ceil(rangeX.max / 4)
    const xsMulti4 = Numbers.range(minXMulti4, maxXMulti4 + 4, 4)
    this.updatePosition(status, xsMulti4)
    this.gameObjects = this.sheets
  }

  calculateRangeX(status: MMapStatus): NumberRange {
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

  calculateLineSegmentRangeX(s: Vector3, t: Vector3): NumberRange | undefined {
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

  updatePosition(status: MMapStatus, xsMulti4: number[]) {
    this.sheets = xsMulti4.map(xMulti4 => {
      const position = status.mapping(new Vector2(xMulti4, 0))
      const sheetIndex = Math.floor(xMulti4 / 4)
      if (this.tileMaterialsMap[sheetIndex] === undefined) {
        this.tileMaterialsMap[sheetIndex] = []
      }
      const sheet = new SheetObject(this.gl, position, this.sharedMaterial, this.tileMaterialsMap[sheetIndex], sheetIndex, this.renderedCanvas)
      sheet.mapUpdate(status)
      return sheet
    })
  }
}