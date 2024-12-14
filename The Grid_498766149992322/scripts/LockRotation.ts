
import * as hz from 'horizon/core';

class LockRotation extends hz.Component<typeof LockRotation> {
  start() {
    const originalRotation = this.entity.rotation.get();
    this.connectLocalBroadcastEvent(hz.World.onUpdate, () => {
      this.entity.rotation.set(originalRotation);
    });
  }
}

hz.Component.register(LockRotation);
