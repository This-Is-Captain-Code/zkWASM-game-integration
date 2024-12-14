import { Vec3, Entity, Component, PropTypes, CodeBlockEvents } from 'horizon/core';

class LinearAnimation extends Component<typeof LinearAnimation> {
  static propsDefinition = {
    positions: { type: PropTypes.Vec3Array, default: [
      new Vec3(48.46, -16, -3.2),
      new Vec3(48.46, 44, -3.2),
    ] },
    speed: { type: PropTypes.Number, default: 1 }, // Units per second
    delay: { type: PropTypes.Number, default: 1 }, // Seconds between position transitions
    trigger: { type: PropTypes.Entity, default: null }, // Optional trigger
    playOnStart: { type: PropTypes.Boolean, default: false }, // Auto-play on start
  };

  private currentPositionIndex = 0;
  private isAnimating = false;
  private isChecked = false; // Add isChecked flag to track if the animation has been triggered

  start() {
    if (this.isChecked) {
      return; // Prevent running the animation again if it has already been triggered
    }

    if (this.props.positions!.length > 1) {
      if (this.props.playOnStart!) {
        this.startAnimation();
      } else if (this.props.trigger) {
        this.connectCodeBlockEvent(this.props.trigger, CodeBlockEvents.OnPlayerEnterTrigger, () => {
          if (!this.isChecked) {
            this.startAnimation(); // Start animation only if not already triggered
            this.isChecked = true; // Mark as triggered
          }
        });
      }
    }
  }

  startAnimation() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.currentPositionIndex = 0;
    this.animateToNextPosition();
  }

  animateToNextPosition() {
    if (this.currentPositionIndex >= this.props.positions!.length - 1) {
      this.isAnimating = false; // Animation complete
      return;
    }

    const startPosition = this.props.positions![this.currentPositionIndex];
    const endPosition = this.props.positions![this.currentPositionIndex + 1];

    const distance = startPosition.distance(endPosition);
    const animationTime = distance / this.props.speed!; // Time to complete the animation

    this.animateEntity(startPosition, endPosition, animationTime, () => {
      this.currentPositionIndex++;

      // Add a delay before moving to the next position
      this.async.setTimeout(() => this.animateToNextPosition(), this.props.delay! * 1000);
    });
  }

  animateEntity(startPosition: Vec3, endPosition: Vec3, animationTime: number, onComplete: () => void) {
    const animationStartTime = Date.now();

    const animationProgress = () => {
      const elapsedTime = (Date.now() - animationStartTime) / 1000; // Convert to seconds
      const progress = Math.min(elapsedTime / animationTime, 1); // Clamp progress to [0, 1]

      // Interpolate position
      const interpolatedPosition = Vec3.lerp(startPosition, endPosition, progress);
      this.entity.position.set(interpolatedPosition);

      if (progress < 1) {
        // Continue animation
        this.async.setTimeout(animationProgress, 16); // 16ms for ~60fps
      } else {
        // Animation complete
        onComplete();
      }
    };

    animationProgress();
  }
}

Component.register(LinearAnimation);



// script with multiple rotation not working!
// import { Vec3, Quaternion, Entity, Component, PropTypes, CodeBlockEvents } from 'horizon/core';

// class LinearAnimation extends Component<typeof LinearAnimation> {
//   static propsDefinition = {
//     objectIndex: { type: PropTypes.Number, default: 0 }, // Index to determine which object's animation to use
//     animations: {
//       type: PropTypes.AssetArray, // Adjusted to use a compatible array type
//       default: [
//         { 
//           positions: [
//             new Vec3(48.46, -16, -3.2),
//             new Vec3(48.46, 40, -3.2),
//           ],
//           rotations: [
//             new Quaternion(0, 0, 0, 1),
//             new Quaternion(0, 0.707, 0, 0.707), // 90 degrees Y-axis
//           ]
//         },
//         {
//           positions: [
//             new Vec3(30, 0, 10),
//             new Vec3(30, 20, 10),
//           ],
//           rotations: [
//             new Quaternion(0, 0, 0, 1),
//             new Quaternion(0, 0.5, 0.5, 0.5), // Arbitrary rotation
//           ]
//         },
//         {
//           positions: [
//             new Vec3(-10, -5, 0),
//             new Vec3(-10, 15, 0),
//           ],
//           rotations: [
//             new Quaternion(0, 0, 0, 1),
//             new Quaternion(0.707, 0, 0.707, 0), // 90 degrees X-axis
//           ]
//         },
//       ]
//     },
//     speed: { type: PropTypes.Number, default: 1 }, // Units per second
//     rotationSpeed: { type: PropTypes.Number, default: 90 }, // Degrees per second
//     delay: { type: PropTypes.Number, default: 1 }, // Seconds between position/rotation transitions
//     trigger: { type: PropTypes.Entity, default: null }, // Optional trigger
//     playOnStart: { type: PropTypes.Boolean, default: false }, // Auto-play on start
//   };

//   private currentPositionIndex = 0;
//   private isAnimating = false;

//   start() {
//     const animations = this.props.animations!;
//     if (animations[this.props.objectIndex]) {
//       if (this.props.playOnStart!) {
//         this.startAnimation();
//       } else if (this.props.trigger) {
//         this.connectCodeBlockEvent(this.props.trigger, CodeBlockEvents.OnPlayerEnterTrigger, () => this.startAnimation());
//       }
//     }
//   }

//   startAnimation() {
//     if (this.isAnimating) return;

//     this.isAnimating = true;
//     this.currentPositionIndex = 0;
//     this.animateToNextState();
//   }

//   animateToNextState() {
//     const animations = this.props.animations!;
//     const animationData = animations[this.props.objectIndex];

//     if (this.currentPositionIndex >= animationData.positions.length - 1) {
//       this.isAnimating = false; // Animation complete
//       return;
//     }

//     const startPosition = animationData.positions[this.currentPositionIndex];
//     const endPosition = animationData.positions[this.currentPositionIndex + 1];
//     const startRotation = animationData.rotations[this.currentPositionIndex];
//     const endRotation = animationData.rotations[this.currentPositionIndex + 1];

//     const distance = startPosition.distance(endPosition);
//     const animationTime = distance / this.props.speed!;
//     const rotationTime = 1 / (this.props.rotationSpeed! / 360);

//     const totalTime = Math.max(animationTime, rotationTime);

//     this.animateEntity(startPosition, endPosition, startRotation, endRotation, totalTime, () => {
//       this.currentPositionIndex++;
//       this.async.setTimeout(() => this.animateToNextState(), this.props.delay! * 1000);
//     });
//   }

//   animateEntity(
//     startPosition: Vec3,
//     endPosition: Vec3,
//     startRotation: Quaternion,
//     endRotation: Quaternion,
//     animationTime: number,
//     onComplete: () => void
//   ) {
//     const animationStartTime = Date.now();

//     const animationProgress = () => {
//       const elapsedTime = (Date.now() - animationStartTime) / 1000;
//       const progress = Math.min(elapsedTime / animationTime, 1);

//       // Interpolate position
//       const interpolatedPosition = Vec3.lerp(startPosition, endPosition, progress);
//       this.entity.position.set(interpolatedPosition);

//       // Interpolate rotation
//       const interpolatedRotation = Quaternion.slerp(startRotation, endRotation, progress);
//       this.entity.rotation.set(interpolatedRotation);

//       if (progress < 1) {
//         this.async.setTimeout(animationProgress, 16);
//       } else {
//         onComplete();
//       }
//     };

//     animationProgress();
//   }
// }

// Component.register(LinearAnimation);
