import Vector2 from '../common/Vector2'

import MMapStatus from './status/MMapStatus'
import MMapEventManager from './event/MMapEventManager'
import MMapCanvasController from './canvas/MMapCanvasController'
import CanvasUtils from '../util/CanvasUtils'
import PolarCoordinate3 from '../common/PolarCoordinate'
import EngineMath from '../engine/common/EngineMath'
import Vector3 from '../common/Vector3'

export default class MMap {

  private static MinZoom: number = 0

  status: MMapStatus

  eventManager: MMapEventManager
  canvasController: MMapCanvasController

  canvas: HTMLCanvasElement

  update: () => void | undefined

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
      this.status.center = this.status.center.add(motion)
      
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

      this.status.zoom += delta * zoomCoeffient
      if (this.status.zoom < MMap.MinZoom) {
        this.status.zoom = MMap.MinZoom
      }
      
      if (this.update !== undefined) {
        this.update()
      }
    }

    this.eventManager = new MMapEventManager(this.canvas, onMove, onZoom, onRotate)
  }

  setupCanvasController() {
    this.canvasController = new MMapCanvasController(this.canvas, this.status)
  }
}