import GameObject from '../../../../engine/object/GameObject';
import Quaternion from '../../../../common/Quaternion';
import Vector3 from '../../../../common/Vector3';
import Material from '../../../../engine/object/material/Material';

export default class SheetObject extends GameObject {

  constructor(
    position: Vector3,
    material: Material
  ) {
    const rotation = Quaternion.fromRadianAndVector3(0, new Vector3(0, 1, 0))
    const scale = Vector3.one().multiply(4)
    super(position, rotation, scale, material)
  }
}