import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';
import { SetTextGizmoText } from 'sysUtils';

class sysCameraChangeTrigger extends hz.Component<typeof sysCameraChangeTrigger> {
  static propsDefinition = {
    cameraMode: { type: hz.PropTypes.String },
    cameraModeText: { type: hz.PropTypes.Entity },
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      switch (this.props.cameraMode) {
        case "FirstPerson":
          this.sendNetworkEvent(player, sysEvents.OnSetCameraModeFirstPerson, null);
          SetTextGizmoText(this.props.cameraModeText, "Camera set to First Person Mode");
          console.log("ENTERED THE PLAYER");
          break;
        case "Fixed":
          const newPosition = hz.Vec3.add(this.entity.position.get(), new hz.Vec3(0, 1, -5));
          const newRotation = hz.Quaternion.fromEuler(new hz.Vec3(0, 0, 0));
          this.sendNetworkEvent(player, sysEvents.OnSetCameraModeFixed, {position: newPosition, rotation: newRotation});
          SetTextGizmoText(this.props.cameraModeText, "Camera set to Fixed Mode");
          break;
        case "Attached":
          const positionOffset = new hz.Vec3(0, 0, -5);
          const translationSpeed = 1;
          const rotationSpeed = 1;
          this.sendNetworkEvent(player, sysEvents.OnSetCameraModeAttached, {target: player, positionOffset: positionOffset, translationSpeed: translationSpeed, rotationSpeed: rotationSpeed});
          SetTextGizmoText(this.props.cameraModeText, "Camera set to Attach Mode");
          break;
        case "Roll":
          this.sendNetworkEvent(player, sysEvents.OnSetCameraRoll, {rollAngle: 30});
          SetTextGizmoText(this.props.cameraModeText, "Camera roll set to 30 degrees");
          break;
        case "FOV":
          this.sendNetworkEvent(player, sysEvents.OnSetCameraFOV, {newFOV: 72.5});
          SetTextGizmoText(this.props.cameraModeText, "Camera FOV set to 72.5");
          break;
        case "PerspectiveSwitching":
          this.sendNetworkEvent(player, sysEvents.OnSetCameraPerspectiveSwitchingEnabled, {enabled: true});
          SetTextGizmoText(this.props.cameraModeText, "Camera Perspective Switching Enabled<br><br>Press PageUp/PageDown to change<br>between 1st person and 3rd person modes");
          break;
        case "Collision":
          this.sendNetworkEvent(player, sysEvents.OnSetCameraCollisionEnabled, {enabled: false});
          SetTextGizmoText(this.props.cameraModeText, "Camera collision disabled");
          break;
      }
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player: hz.Player) => {
      switch (this.props.cameraMode) {
        case "FirstPerson":
          this.sendNetworkEvent(player, sysEvents.OnSetCameraModeThirdPerson, null);
          SetTextGizmoText(this.props.cameraModeText, "First Person Camera");
          break;
        case "Fixed":
          this.sendNetworkEvent(player, sysEvents.OnSetCameraModeThirdPerson, null);
          SetTextGizmoText(this.props.cameraModeText, "Fixed Camera");
          break;
        case "Attached":
          this.sendNetworkEvent(player, sysEvents.OnSetCameraModeThirdPerson, null);
          SetTextGizmoText(this.props.cameraModeText, "Attached Camera");
          break;
        case "Roll":
          this.sendNetworkEvent(player, sysEvents.OnSetCameraRoll, {rollAngle: 0});
          SetTextGizmoText(this.props.cameraModeText, "Camera Roll");
          break;
        case "FOV":
          this.sendNetworkEvent(player, sysEvents.OnResetCameraFOV, null);
          SetTextGizmoText(this.props.cameraModeText, "Camera FOV");
          break;
        case "PerspectiveSwitching":
          this.sendNetworkEvent(player, sysEvents.OnSetCameraPerspectiveSwitchingEnabled, {enabled: false});
          SetTextGizmoText(this.props.cameraModeText, "Camera Perspective Switching");
          break;
        case "Collision":
          this.sendNetworkEvent(player, sysEvents.OnSetCameraCollisionEnabled, {enabled: true});
          SetTextGizmoText(this.props.cameraModeText, "Camera collision enabled");
          break;
      }
    });
  }
}
hz.Component.register(sysCameraChangeTrigger);
