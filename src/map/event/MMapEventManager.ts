import Vector2 from '../../common/Vector2'

export default class MMapEventManager {

  isMouseDown: boolean
  isMouseDoubleDown: boolean

  previousX: number | undefined
  previousY: number | undefined
  deltaX: number | undefined
  deltaY: number | undefined

  canvas: HTMLCanvasElement
  onMove: (motion: Vector2) => void | undefined
  onZoom: (delta: number) => void | undefined
  onRotate: (motion: Vector2) => void | undefined

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
    onRotate: (motion: Vector2) => void
  ) {
    this.canvas = canvas
    this.onMove = onMove
    this.onZoom = onZoom
    this.onRotate = onRotate
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
      this.deltaX = undefined
      this.deltaY = undefined
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
        this.deltaX = undefined
        this.deltaY = undefined
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

      const animate = () => {
        if (this.onMove === undefined) {
          return
        }
        if (this.deltaX === undefined || this.deltaY === undefined) {
          return
        }
        if (this.deltaX === 0 && this.deltaY === 0) {
          return
        }
        this.onMove(new Vector2(this.deltaX, this.deltaY))
        this.deltaX = (Math.abs(this.deltaX) <= 1) ? 0 : (this.deltaX > 0) ? this.deltaX - 2 : this.deltaX + 2
        this.deltaY = (Math.abs(this.deltaY) <= 1) ? 0 : (this.deltaY > 0) ? this.deltaY - 2 : this.deltaY + 2
        requestAnimationFrame(animate)  
      }
      animate()
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

        this.deltaX = event.offsetX - this.previousX
        this.deltaY = event.offsetY - this.previousY
        const motion = new Vector2(this.deltaX, this.deltaY)

        if (this.isMouseDoubleDown && this.onRotate !== undefined) {
          this.onRotate(motion)
        }
        else if (this.isMouseDoubleDown === false && this.onMove !== undefined) {
          this.onMove(motion)
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