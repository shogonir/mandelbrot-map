import LifeCycle from './LifeCycle';
import GameObject from '../GameObject';

export default class LifeCycleRotateY implements LifeCycle {

  onUpdate(gameObject: GameObject) {
    gameObject.rotation = gameObject.rotation.rotateY(1)
  }
}