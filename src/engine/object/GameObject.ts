import Vector3 from '../../common/Vector3'
import Quaternion from '../../common/Quaternion'

export default interface GameObject {

  position: Vector3
  rotation: Quaternion
  scale: Vector3

}