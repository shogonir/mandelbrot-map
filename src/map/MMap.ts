import Vector2 from '../common/Vector2'

import MMapStatus from './status/MMapStatus'
import MMapEventManager from './event/MMapEventManager'
import MMapCanvasController from './canvas/MMapCanvasController'

export default class MMap {

  status: MMapStatus

  eventManager: MMapEventManager
  canvasController: MMapCanvasController

  canvas: HTMLCanvasElement

  constructor(canvasId: string, center: Vector2, zoom: number) {
    this.status = new MMapStatus(center, zoom)
    this.setupCanvas(canvasId)
    this.setupEventManager()
    this.setupCanvasController()
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
    const onMove = (motion: Vector2) => {
      console.log('onMove', motion)
    }
    this.eventManager = new MMapEventManager(this.canvas, onMove)
  }

  setupCanvasController() {
    this.canvasController = new MMapCanvasController(this.canvas)
  }
}