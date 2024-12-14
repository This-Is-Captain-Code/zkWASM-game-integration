import * as hz from 'horizon/core';

type Props = {};

class CollisionDetector extends hz.Component<Props> {

    static propsDefinition = {};

    start() {
        // Listen for ball collisions with any other entity.
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnEntityCollision,
          (collidedWith: hz.Entity, collisionAt: hz.Vec3, normal: hz.Vec3,
            relativeVelocity: hz.Vec3, localColliderName: string, otherColliderName: string) => {
              console.log("COLLISION BABY!");
              collidedWith.scale.set(new hz.Vec3(0, 0, 0));
          });

          this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerCollision,
            (collidedWith: hz.Player) => {
                console.log("COLLISION PLAYER!!!!!");
            });
    }
}

hz.Component.register(CollisionDetector);