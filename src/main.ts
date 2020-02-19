import MMap from './map/MMap'
import Vector2 from './common/Vector2'
import { Optional } from './type/type'
import Sphere3 from './common/Sphere3'
import Vector3 from './common/Vector3'
import Ray3 from './common/Ray3'


(() => {
  console.log(new Sphere3(Vector3.zero(), 1).intersectsWithRay3(new Ray3(new Vector3(1, 1, 1), new Vector3(-1, -1, -1))))

  // create a map
  const map = new MMap('map', new Vector2(0, 0), 2.5)

  // zoom changed callback
  const mayBeZoomPara = document.getElementById('zoom')
  if (mayBeZoomPara === null) {
    return
  }
  const zoomPara: HTMLElement = mayBeZoomPara

  map.onZoomChanged = (zoom: number) => {
    zoomPara.innerText = `zoom: ${zoom.toFixed(2)}`
  }

  // center changed callback
  const mayBeCenterPara = document.getElementById('center')
  if (mayBeCenterPara === null) {
    return
  }
  const centerPara: HTMLElement = mayBeCenterPara

  map.onCenterChanged = (center: Vector2) => {
    centerPara.innerText = `center: (${center.x.toFixed(4)}, ${center.y.toFixed(4)})`
  }

  // reset rotation
  const mayBeResetRotationButton = document.getElementById('reset-rotation')
  if (mayBeResetRotationButton === null) {
    return
  }
  const resetRotationButton = mayBeResetRotationButton

  resetRotationButton.addEventListener('click', () => {
    map.resetRotation()
  })

  // set position
  const mayBeInputX = document.getElementById('set-x')
  const mayBeInputY = document.getElementById('set-y')
  const mayBeInputZ = document.getElementById('set-z')
  const mayBeSetPositionButton = document.getElementById('set-position')
  if (mayBeInputX === null || mayBeInputY === null || mayBeInputZ === null || mayBeSetPositionButton === null) {
    return
  }
  const inputX: HTMLInputElement = mayBeInputX as HTMLInputElement
  const inputY: HTMLInputElement = mayBeInputY as HTMLInputElement
  const inputZ: HTMLInputElement = mayBeInputZ as HTMLInputElement
  const setPositionButton: HTMLButtonElement = mayBeSetPositionButton as HTMLButtonElement
  
  setPositionButton.addEventListener('click', () => {
    const x = parseFloat(inputX.value)
    const y = parseFloat(inputY.value)
    const z = parseFloat(inputZ.value)
    if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
      return
    }
    map.setPosition(x, y, z)
  })

  const mayBeEarthModeButton = document.getElementById('e-mode')
  if (mayBeEarthModeButton === null) {
    return
  }
  const earthModeButton: HTMLButtonElement = mayBeEarthModeButton as HTMLButtonElement

  earthModeButton.addEventListener('click', () => {
    map.setEarthMode(!map.isEarthMode())
  })
})()
