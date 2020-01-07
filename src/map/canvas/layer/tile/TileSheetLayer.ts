import Layer from '../../../../engine/world/layer/Layer';
import GameObject from '../../../../engine/object/GameObject';
import MMapStatus from '../../../status/MMapStatus';
import Quaternion from '../../../../common/Quaternion';
import Vector3 from '../../../../common/Vector3';
import SingleColorMaterial from '../../../../engine/object/material/SingleColorMaterial';
import PlaneGeometry from '../../../../engine/object/geometry/PlaneGeometry';
import Color from '../../../../common/Color';
import SheetObject from './SheetObject';
import Vector2 from '../../../../common/Vector2';

export default class TileSheetLayer implements Layer {

  gameObjects: GameObject[]

  sheet: SheetObject

  constructor(gl: WebGL2RenderingContext, status: MMapStatus) {
    this.gameObjects = []

    const planeGeometry = new PlaneGeometry(1.0)
    const blueMaterial = new SingleColorMaterial(gl, planeGeometry, Color.blue())

    this.sheet = new SheetObject(Vector3.zero(), blueMaterial)

    this.gameObjects.push(this.sheet)
  }

  update(status: MMapStatus) {
    this.updatePosition(status)
  }

  updatePosition(status: MMapStatus) {
    this.sheet.position = status.mappingVector2(Vector2.zero()).toVector3()
  }
}