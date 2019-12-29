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
  
    const self = this
    this.onMouseDown = () => {
      self.isMouseDown = true
      self.previousX = undefined
      self.previousY = undefined
    }

    this.canvas.addEventListener('mousedown', this.onMouseDown)
  }

  setupContextMenuEvent() {
    if (this.onContextMenu !== undefined) {
      return
    }

    const self = this
    this.onContextMenu = () => {
      if (self.isMouseDown) {
        self.isMouseDoubleDown = true
        self.previousX = undefined
        self.previousY = undefined
      }
    }
    
    this.canvas.addEventListener('contextmenu', this.onContextMenu)
  }

  setupMouseUpEvent() {
    if (this.onMouseUp !== undefined) {
      return
    }

    const self = this
    this.onMouseUp = () => {
      self.isMouseDown = false
      self.isMouseDoubleDown = false
    }

    this.canvas.addEventListener('mouseup', this.onMouseUp)
  }

  setupMouseOutEvent() {
    if (this.onMouseOut !== undefined) {
      return
    }

    const self = this
    this.onMouseOut = () => {
      self.isMouseDown = false
      self.isMouseDoubleDown = false
    }

    this.canvas.addEventListener('mouseout', this.onMouseOut)
  }

  setupMouseMoveEvent() {
    if (this.onMouseMove !== undefined) {
      return
    }

    const self = this
    this.onMouseMove = (event: MouseEvent) => {
      if (self.isMouseDown) {

        if (self.previousX === undefined || self.previousY === undefined) {
          self.previousX = event.offsetX
          self.previousY = event.offsetY
          return
        }

        const moveX = event.offsetX - self.previousX
        const moveY = event.offsetY - self.previousY

        if (self.onMove !== undefined) {
          self.onMove(new Vector2(moveX, moveY))
        }

        self.previousX = event.offsetX
        self.previousY = event.offsetY
      }
    }

    this.canvas.addEventListener('mousemove', this.onMouseMove)
  }

  setupMouseWheelEvent() {
    if (this.onMouseWheel !== undefined) {
      return
    }

    const self = this
    this.onMouseWheel = (event: WheelEvent) => {
      if (self.onZoom !== undefined) {
        self.onZoom(event.deltaY)
      }
    }

    this.canvas.addEventListener('wheel', this.onMouseWheel)
  }
}