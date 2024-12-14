import { PropTypes } from 'horizon/core';
import { World, CodeBlockEvents, Entity, Player } from 'horizon/core';
import { Component, Vec3, Quaternion } from 'horizon/core';

class ArenaCloseAnimation extends Component<typeof ArenaCloseAnimation> {
  static propsDefinition = {
    xDistance: { type: PropTypes.Number, default: 5 },
    yDistance: { type: PropTypes.Number, default: 5 },
    zDistance: { type: PropTypes.Number, default: 5 },
    duration: { type: PropTypes.Number, default: 5 },
    trigger: { type: PropTypes.Entity, default: null },
    trigger2: { type: PropTypes.Entity, default: null },
  };

  private startPosition!: Vec3;
  private endPosition!: Vec3;
  private progress: number = 0;
  private moving: boolean = false;
  private isChecked: boolean = false; // Track if the animation has been run
  private isChecked2: boolean = false;

  start() {
    // If the animation has already been triggered, don't start it again
    if (this.isChecked || this.isChecked2) {
      return;
    }

    this.startPosition = this.entity.position.get(); // Start position is the entity's current position
    if (this.props.xDistance < 0){
      this.endPosition = this.startPosition.add(
        new Vec3(this.props.xDistance!, this.props.yDistance!, this.props.zDistance!)
      );
    }
    else {
      this.endPosition = this.startPosition.add(
        new Vec3(this.props.xDistance!, this.props.yDistance!, this.props.zDistance!)
      ); // End position is the entity's current position + distance
    }
    console.log("Start pod = ", this.startPosition, ", end pos = ", this.endPosition);

    if (this.props.trigger!) {
      this.connectCodeBlockEvent(this.props.trigger!, CodeBlockEvents.OnPlayerExitTrigger, () => {
        console.log('Player entered the trigger');

        // Ensure we only run the animation once
        if (!this.isChecked && !this.moving) {
          this.isChecked = true; // Mark as checked (animation should not run again)
          this.progress = 0; // Reset progress
          this.moving = true; // Start animation movement
        }
      });
    }

    if (this.props.trigger2!) {
      this.connectCodeBlockEvent(this.props.trigger2!, CodeBlockEvents.OnPlayerExitTrigger, () => {
        console.log('Player entered the trigger');

        // Ensure we only run the animation once
        if (!this.isChecked2 && !this.moving) {
          this.isChecked2 = true; // Mark as checked (animation should not run again)
          this.progress = 0; // Reset progress
          this.moving = true; // Start animation movement
        }
      });
    }

    // Handling animation over time
    this.connectLocalBroadcastEvent(World.onUpdate, ({ deltaTime }) => {
      if (this.moving) {
        this.progress = Math.min(this.progress + deltaTime / this.props.duration!, 1); // Accumulate progress, capping at 1
        const position = Vec3.lerp(this.startPosition, this.endPosition, this.progress);
        this.entity.position.set(position);

        // Once animation is complete, stop moving
        if (this.progress === 1) {
          this.moving = false;
        }
      }
    });
  }
}

Component.register(ArenaCloseAnimation);




// Old code working but teleporting not smoooth
// import { Vec3, Entity, Component, PropTypes, CodeBlockEvents } from 'horizon/core';
// import * as hz from 'horizon/core';

// class ArenaCloseAnimation extends Component<typeof ArenaCloseAnimation> {
//   static propsDefinition = {
//     distance: { type: hz.PropTypes.Number },
//     speed: { type: PropTypes.Number, default: 1 }, // Units per second
//     delay: { type: PropTypes.Number, default: 1 }, // Seconds between position transitions
//     trigger: { type: PropTypes.Entity, default: null }, // Optional trigger
//     playOnStart: { type: PropTypes.Boolean, default: false }, // Auto-play on start
//   };

//   private currentPositionIndex = 0;
//   private isAnimating = false;

//   start() {
//       if (this.props.playOnStart!) {
//         this.startAnimation();
//       } else if (this.props.trigger) {
//         this.connectCodeBlockEvent(this.props.trigger, CodeBlockEvents.OnPlayerEnterTrigger, () => this.startAnimation());
//       }
//   }

//   startAnimation() {
//     if (this.isAnimating) return;

//     this.isAnimating = true;
//     this.currentPositionIndex = 0;
//     this.animateToNextPosition();
//   }

//   animateToNextPosition() {
//     const startPosition = this.entity.transform.localPosition.get();
//       const endPosition = new hz.Vec3(startPosition.x, startPosition.y + this.props.distance!, startPosition.z);

//     const distance = startPosition.distance(endPosition);
//     const animationTime = distance / this.props.speed!; // Time to complete the animation

//     this.animateEntity(startPosition, endPosition, animationTime, () => {
//       this.currentPositionIndex++;

//       // Add a delay before moving to the next position
//       this.async.setTimeout(() => this.animateToNextPosition(), this.props.delay! * 1000);
//     });
//   }

//   animateEntity(startPosition: Vec3, endPosition: Vec3, animationTime: number, onComplete: () => void) {
//     const animationStartTime = Date.now();

//     const animationProgress = () => {
//       const elapsedTime = (Date.now() - animationStartTime) / 1000; // Convert to seconds
//       const progress = Math.min(elapsedTime / animationTime, 1); // Clamp progress to [0, 1]

//       // Interpolate position
//       const interpolatedPosition = Vec3.lerp(startPosition, endPosition, progress);
//       this.entity.position.set(interpolatedPosition);

//       if (progress < 1) {
//         // Continue animation
//         this.async.setTimeout(animationProgress, 16); // 16ms for ~60fps
//       } else {
//         // Animation complete
//         onComplete();
//       }
//     };

//     animationProgress();
//   }
// }

// Component.register(ArenaCloseAnimation);