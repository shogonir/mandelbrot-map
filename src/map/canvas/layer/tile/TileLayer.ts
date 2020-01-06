import Layer from '../../../../engine/world/layer/Layer';
import GameObject from '../../../../engine/object/GameObject';
import MMapStatus from '../../../status/MMapStatus';
import Quaternion from '../../../../common/Quaternion';
import Vector3 from '../../../../common/Vector3';
import SingleColorMaterial from '../../../../engine/object/material/SingleColorMaterial';
import PlaneGeometry from '../../../../engine/object/geometry/PlaneGeometry';
import Color from '../../../../common/Color';

export default class TileLayer implements Layer {

  gameObjects: GameObject[]

  tile: GameObject

  constructor(gl: WebGL2RenderingContext, status: MMapStatus) {
    this.gameObjects = []

    const planeGeometry = new PlaneGeometry(1.0)
    const blueMaterial = new SingleColorMaterial(gl, planeGeometry, Color.blue())

    this.tile = new GameObject(
      Vector3.zero(),
      Quaternion.fromRadianAndVector3(0, new Vector3(0, 1, 0)),
      Vector3.one(),
      blueMaterial
    )

    this.gameObjects.push(this.tile)
  }
}