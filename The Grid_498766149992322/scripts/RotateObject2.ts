import { World } from 'horizon/core';
import { Vec3, Entity, Component, Quaternion, PropTypes, CodeBlockEvents } from 'horizon/core';

// Define the rotation speed in degrees per second
const rotationSpeedDegrees = 30;

// Convert the rotation speed to radians per second
const rotationSpeedRadians = rotationSpeedDegrees * Math.PI / 180;

class RotateObject extends Component<typeof RotateObject> {
  static propsDefinition = {
    rotationSpeed: { type: PropTypes.Number, default: rotationSpeedDegrees },
    trigger: { type: PropTypes.Entity },
  };

  private rotationAxis = new Vec3(0, 1, 0); // Y axis for up direction
  private rotationQuaternion = new Quaternion(0, 0, 0, 1);
  public isRotating = true;

  start() {
    // Connect to the update event to rotate the object every frame
    this.connectLocalBroadcastEvent(World.onUpdate, (updateData) => {
      this.rotateObject(updateData.deltaTime);
    });

    // Connect to the trigger event
    this.connectCodeBlockEvent(this.props.trigger!.as(Entity)!, CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
      this.stopRotation();
    });
  }

  rotateObject(deltaTime: number) {
    if (!this.isRotating) return;

    // Calculate the rotation amount based on the speed and time elapsed
    const rotationAmount = rotationSpeedRadians * deltaTime;

    // Rotate the object around the Y axis by the calculated amount
    this.rotationQuaternion = Quaternion.mul(this.rotationQuaternion, Quaternion.fromAxisAngle(this.rotationAxis, rotationAmount));

    // Apply the rotation to the object
    this.entity.rotation.set(this.rotationQuaternion);
  }

  stopRotation() {
    this.isRotating = false;
    this.entity.rotation.set(new Quaternion(0, 0, 0, 1)); // Reset rotation to 0 degrees
  }
}

Component.register(RotateObject);
