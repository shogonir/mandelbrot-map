import Vector2 from "../../common/Vector2"

export default class MMapEventManager {

  isMouseDown: boolean
  isMouseDoubleDown: boolean

  previousX: number | undefined
  previousY: number | undefined

  canvas: HTMLCanvasElement
  onMove: (motion: Vector2) => void | undefined
  onZoom: (delta: number) => void | undefined

  onMouseDown: () => void | undefined
  onContextMenu: () => void | undefined
  onMouseUp: () => void | undefined
  onMouseOut: () => void | undefined
  onMouseMove: (event: MouseEvent) => void | undefined
  onMouseWheel: (event: WheelEvent) => void | undefined

  constructor(
    canvas: HTMLCanvasElement,
    onMove: (motion: Vector2) => void,
    onZoom: (delta: number) => void,
  ) {
    this.canvas = canvas
    this.onMove = onMove
    this.onZoom = onZoom
    this.isMouseDown = false
    this.isMouseDoubleDown = false
    this.previousX = undefined
    this.previousY = undefined

    this.canvas.oncontextmenu = () => false
    this.canvas.onwheel = () => false

    this.setupMouseEvents()
  }

  setupMouseEvents() {
    this.setupMouseDownEvent()
    this.setupContextMenuEvent()
    this.setupMouseUpEvent()
    this.setupMouseOutEvent()
    this.setupMouseMoveEvent()
    this.setupMouseWheelEvent()
  }

  setupMouseDownEvent() {
    if (this.onMouseDown !== undefined) {
      return
    }
  
    this.onMouseDown = () => {
      this.isMouseDown = true
      this.previousX = undefined
      this.previousY = undefined
    }

    this.canvas.addEventListener('mousedown', this.onMouseDown)
  }

  setupContextMenuEvent() {
    if (this.onContextMenu !== undefined) {
      return
    }

    this.onContextMenu = () => {
      if (this.isMouseDown) {
        this.isMouseDoubleDown = true
        this.previousX = undefined
        this.previousY = undefined
      }
    }
    
    this.canvas.addEventListener('contextmenu', this.onContextMenu)
  }

  setupMouseUpEvent() {
    if (this.onMouseUp !== undefined) {
      return
    }

    this.onMouseUp = () => {
      this.isMouseDown = false
      this.isMouseDoubleDown = false
    }

    this.canvas.addEventListener('mouseup', this.onMouseUp)
  }

  setupMouseOutEvent() {
    if (this.onMouseOut !== undefined) {
      return
    }

    this.onMouseOut = () => {
      this.isMouseDown = false
      this.isMouseDoubleDown = false
    }

    this.canvas.addEventListener('mouseout', this.onMouseOut)
  }

  setupMouseMoveEvent() {
    if (this.onMouseMove !== undefined) {
      return
    }

    this.onMouseMove = (event: MouseEvent) => {
      if (this.isMouseDown) {

        if (this.previousX === undefined || this.previousY === undefined) {
          this.previousX = event.offsetX
          this.previousY = event.offsetY
          return
        }

        const moveX = event.offsetX - this.previousX
        const moveY = event.offsetY - this.previousY

        if (this.onMove !== undefined) {
          this.onMove(new Vector2(moveX, moveY))
        }

        this.previousX = event.offsetX
        this.previousY = event.offsetY
      }
    }

    this.canvas.addEventListener('mousemove', this.onMouseMove)
  }

  setupMouseWheelEvent() {
    if (this.onMouseWheel !== undefined) {
      return
    }

    this.onMouseWheel = (event: WheelEvent) => {
      if (this.onZoom !== undefined) {
        this.onZoom(event.deltaY)
      }
    }

    this.canvas.addEventListener('wheel', this.onMouseWheel)
  }
}