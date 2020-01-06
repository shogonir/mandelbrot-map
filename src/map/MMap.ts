import Vector2 from '../common/Vector2'

import MMapStatus from './status/MMapStatus'
import MMapEventManager from './event/MMapEventManager'
import MMapCanvasController from './canvas/MMapCanvasController'
import MMapRenderer from './render/MMapRenderer'
import CanvasUtils from '../util/CanvasUtils'

export default class MMap {

  private static MinZoom: number = 0

  status: MMapStatus

  eventManager: MMapEventManager
  canvasController: MMapCanvasController
  renderer: MMapRenderer | undefined

  canvas: HTMLCanvasElement

  update: () => void | undefined

  constructor(canvasId: string, center: Vector2, zoom: number) {
    this.setupCanvas(canvasId)

    this.status = new MMapStatus(center, zoom, this.canvas.width, this.canvas.height)
    this.status.update()

    this.setupCanvasController()

    const self = this
    this.update = () => {
      if (this.renderer === undefined) {
        return
      }
      this.status.update()
      // this.renderer.update(self.status)
      this.canvasController.update(this.status)
    }

    this.setupEventManager()
    this.setupRenderer()
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
    const self = this
    
    const onMove = (motionInPixel: Vector2) => {
      const ptu = CanvasUtils.calculatePixelToUnit(self.status.zoom)
      const motion = motionInPixel.multiply(ptu)
      motion.x *= -1
      self.status.center = self.status.center.add(motion)
      
      if (self.update !== undefined) {
        self.update()
      }
    }

    const zoomCoeffient = 0.01
    const onZoom = (delta: number) => {
      if (delta === 0) {
        return
      }
      
      self.status.zoom += delta * zoomCoeffient
      if (self.status.zoom < MMap.MinZoom) {
        this.status.zoom = MMap.MinZoom
      }
      
      if (self.update !== undefined) {
        self.update()
      }
    }

    this.eventManager = new MMapEventManager(this.canvas, onMove, onZoom)
  }

  setupCanvasController() {
    this.canvasController = new MMapCanvasController(this.canvas, this.status)
  }

  setupRenderer() {
    this.renderer = new MMapRenderer()
  }
}