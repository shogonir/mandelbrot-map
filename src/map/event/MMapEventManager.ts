import Vector2 from "../../common/Vector2"

export default class MMapEventManager {

  isMouseDown: boolean
  isMouseDoubleDown: boolean

  previousX: number | undefined
  previousY: number | undefined

  constructor(canvas: HTMLCanvasElement, onMove: (motion: Vector2) => void) {
    this.isMouseDown = false
    this.isMouseDoubleDown = false
    this.previousX = undefined
    this.previousY = undefined

    const self = this
    canvas.oncontextmenu = () => false
    canvas.addEventListener('mousedown', () => {
      self.isMouseDown = true
      self.previousX = undefined
      self.previousY = undefined
    })
    canvas.addEventListener('contextmenu', () => {
      if (self.isMouseDown) {
        self.isMouseDoubleDown = true
        self.previousX = undefined
        self.previousY = undefined
      }
    })
    canvas.addEventListener('mouseup', () => {
      self.isMouseDown = false
      self.isMouseDoubleDown = false
    })
    canvas.addEventListener('mouseout', () => {
      self.isMouseDown = false
      self.isMouseDoubleDown = false
    })
    canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if (self.isMouseDown) {

        if (self.previousX === undefined || self.previousY === undefined) {
          self.previousX = event.offsetX
          self.previousY = event.offsetY
          return
        }

        const moveX = event.offsetX - self.previousX
        const moveY = event.offsetY - self.previousY

        onMove(new Vector2(moveX, moveY))

        self.previousX = event.offsetX
        self.previousY = event.offsetY
      }
    })
  }
}