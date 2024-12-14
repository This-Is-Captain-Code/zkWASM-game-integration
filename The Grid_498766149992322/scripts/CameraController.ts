import { Component, PropTypes, Entity, TriggerGizmo, CodeBlockEvents, Player } from 'horizon/core';
import LocalCamera from 'horizon/camera';

class CameraController extends Component<typeof CameraController> {
  static propsDefinition = {
    camDuration: { type: PropTypes.Number, default: 1 }
  };

  start() {
    const triggerGizmo = this.entity.as(TriggerGizmo);
    if (triggerGizmo) {
      this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player: Player) => {
        LocalCamera.setCameraModeFirstPerson();
        console.log("ENTERED!");
      });
    }
  }
}

Component.register(CameraController);
