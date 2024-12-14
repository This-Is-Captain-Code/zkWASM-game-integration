import { Component, PropTypes, Player, CodeBlockEvents, Asset, SpawnController, Vec3 } from 'horizon/core';

class Interactable extends Component<typeof Interactable> {
  static propsDefinition = {
    interactableAsset: { type: PropTypes.Asset },
  };

  start() {
    this.connectLocalEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player: Player) => {
      this.spawnInteractableInHand(player);
    });
  }

  spawnInteractableInHand(player: Player) {
    const interactableAsset = this.props.interactableAsset!.as(Asset);
    const spawnPosition = player.rightHand.position.get();
    const spawnRotation = player.rightHand.rotation.get();

    const spawnController = new SpawnController(interactableAsset, spawnPosition, spawnRotation, new Vec3(1, 1, 1));
    spawnController.spawn().then((value: void) => {
      // spawn is complete, do nothing
    });
  }
}

Component.register(Interactable);
