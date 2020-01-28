import Vector2 from '../common/Vector2'

import MMapStatus from './status/MMapStatus'
import MMapEventManager from './event/MMapEventManager'
import MMapCanvasController from './canvas/MMapCanvasController'
import CanvasUtils from '../util/CanvasUtils'
import PolarCoordinate3 from '../common/PolarCoordinate3'
import EngineMath from '../engine/common/EngineMath'
import Vector3 from '../common/Vector3'

export default class MMap {

  public static MinZoom: number = 0
  public static MaxZoom: number = 19
  public static MinY: number = -2
  public static MaxY: number = 2
  public static MinX: number = -2
  public static MaxX: number = 2

  status: MMapStatus

  eventManager: MMapEventManager
  canvasController: MMapCanvasController

  canvas: HTMLCanvasElement

  update: (() => void) | undefined

  onZoomChanged: ((zoom: number) => void) | undefined
  onCenterChanged: ((center: Vector2) => void) | undefined

  constructor(canvasId: string, center: Vector2, zoom: number) {
    this.setupCanvas(canvasId)

    const polar = new PolarCoordinate3(10, -Math.PI / 2, 1 * EngineMath.deg2Rad)
    this.status = new MMapStatus(center, zoom, this.canvas.width, this.canvas.height, polar, Vector3.zero())
    this.status.update()

    this.setupCanvasController()

    this.update = () => {
      this.status.update()
      this.canvasController.update(this.status)
    }

    this.onZoomChanged = undefined
    this.onCenterChanged = undefined

    this.status.mapUpdate = this.update

    this.setupEventManager()
  }

  setupCanvas(canvasId: string) {
    const mayBeElement: HTMLElement | null = document.getElementById(canvasId)
    if (mayBeElement === null) {
      console.warn('canvas element not found')
      return
    }
    const element: HTMLElement = mayBeElement

    this.canvas = element as HTMLCanvasElement
  }

  setupEventManager() {
    
    const onMove = (motionInPixel: Vector2) => {
      const ptu = CanvasUtils.calculatePixelToUnit(this.status.zoom)
      let motion = motionInPixel.multiply(ptu)
      motion.x *= -1
      motion = motion.rotate(this.status.polar.phi + Math.PI / 2)

      const center = this.status.center.add(motion)
      this.status.center = center

      if (center.x < MMap.MinX) {
        center.x = (center.x - 2) % 4 + 2
      }
      if (center.x > MMap.MaxX) {
        center.x = (center.x + 2) % 4 - 2
      }

      if (center.y < MMap.MinY) {
        center.y = MMap.MinY
      }
      if (center.y > MMap.MaxY) {
        center.y = MMap.MaxY
      }

      if (this.onCenterChanged !== undefined) {
        this.onCenterChanged(center.clone())
      }

      if (this.update !== undefined) {
        this.update()
      }
    }

    const onRotate = (motionInPixel: Vector2) => {
      const ptu = CanvasUtils.calculatePixelToUnit(this.status.zoom)
      const motion = motionInPixel.multiply(ptu)
      this.status.polar.phi -= motion.x
      this.status.polar.theta -= motion.y

      if (this.status.polar.theta < 1 * EngineMath.deg2Rad) {
        this.status.polar.theta = 1 * EngineMath.deg2Rad
      }
      if (this.status.polar.theta > 60 * EngineMath.deg2Rad) {
        this.status.polar.theta = 60 * EngineMath.deg2Rad
      }

      if (this.update !== undefined) {
        this.update()
      }
    }

    const zoomCoeffient = 0.01
    const onZoom = (delta: number) => {
      if (delta === 0) {
        return
      }

      if (this.status.zoom === MMap.MinZoom && delta < 0) {
        return
      }
      if (this.status.zoom === MMap.MaxZoom && delta > 0) {
        return
      }

      this.status.zoom += delta * zoomCoeffient
      if (this.status.zoom < MMap.MinZoom) {
        this.status.zoom = MMap.MinZoom
      }
      if (this.status.zoom > MMap.MaxZoom) {
        this.status.zoom = MMap.MaxZoom
      }
      
      if (this.update !== undefined) {
        this.update()
      }
      if (this.onZoomChanged !== undefined) {
        this.onZoomChanged(this.status.zoom)
      }
    }

    this.eventManager = new MMapEventManager(this.canvas, onMove, onZoom, onRotate)
  }

  setupCanvasController() {
    this.canvasController = new MMapCanvasController(this.canvas, this.status)
  }
}