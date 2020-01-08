import Vector3 from './Vector3'

export default class PolarCoordinate3 {

  radius: number

  /**
   * azimuth as radian
   */
  phi: number

  /**
   * elevation as radian
   */
  theta: number

  constructor(radius: number, phi: number, theta: number) {
    this.radius = radius
    this.phi = phi
    this.theta = theta
  }

  toVector3(): Vector3 {
    const x = this.radius * Math.sin(this.theta) * Math.cos(this.phi)
    const y = this.radius * Math.sin(this.theta) * Math.sin(this.phi)
    const z = this.radius * Math.cos(this.theta)
    return new Vector3(x, y, z)
  }

  /**
   * vector from this point to z-axis (0 < theta < pi/2)
   */
  toUpVector3(): Vector3 {
    const x = -Math.cos(this.theta) * Math.cos(this.phi)
    const y = -Math.cos(this.theta) * Math.sin(this.phi)
    const z = Math.sin(this.theta)
    return  new Vector3(x, y, z).normalize()
  }

  /**
   * vector from this point to right (0 < theta < pi/2)
   */
  toRightVector3(): Vector3 {
    return new Vector3(-Math.sin(this.phi), Math.cos(this.phi), 0)
  }
}