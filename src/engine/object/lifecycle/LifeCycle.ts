import GameObject from '../GameObject';

export default interface LifeCycle {

  onUpdate(gameObject: GameObject): void
}