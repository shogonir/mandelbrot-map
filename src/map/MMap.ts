import Vector2 from '../common/Vector2'

import MMapController from './control/MMapController'
import MMapStatus from './status/MMapStatus'
import MMapEventManager from './event/MMapEventManager'

export default class MMap {

  status: MMapStatus
  controller: MMapController
  eventManager: MMapEventManager

  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  constructor(canvasId: string, center: Vector2, zoom: number) {
    this.status = new MMapStatus(center, zoom)
    this.setupCanvas(canvasId)
    
    const onMove = (motion: Vector2) => {
      console.log('onMove', motion)
    }
    this.eventManager = new MMapEventManager(this.canvas, onMove)
  }

  setupCanvas(canvasId: string) {
    const mayBeElement: HTMLElement | null = document.getElementById(canvasId)
    if (mayBeElement === null) {
      console.warn('canvas element not found')
      return
    }
    const element: HTMLElement = mayBeElement

    this.canvas = element as HTMLCanvasElement
    this.context = this.canvas.getContext('2d')
  }
}