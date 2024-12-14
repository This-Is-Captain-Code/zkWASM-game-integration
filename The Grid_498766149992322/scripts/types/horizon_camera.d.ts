declare module 'horizon/camera' {
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */
import { Vec3, Quaternion, Player, Entity, ReadableHorizonProperty, HorizonProperty } from 'horizon/core';
export declare const ApiName = "camera";
/**
 * The styles for camera transitions.
 */
export declare enum Easing {
    EaseIn = 0,
    EaseOut = 1,
    EaseInOut = 2,
    Linear = 3
}
/**
 * The possible reasons for a camera transition to end.
 */
export declare enum CameraTransitionEndReason {
    Completed = 0,
    Interrupted = 1,
    Error = 2
}
/**
 * The view modes for cameras.
 */
export declare enum CameraMode {
    FirstPerson = 0,
    ThirdPerson = 1,
    Attach = 2,
    Fixed = 3,
    Orbit = 4,
    Pan = 5
}
/**
 * The options for transitioning between cameras.
 *
 * @remarks
 *
 * Type Parameters:
 *
 * delay - The time, in seconds, to wait until the transition begins.
 * Defaults to 0.
 *
 * duration - The time, in seconds, to transition from the previous
 * camera to the new local camera. If not set, the transition is instant.
 *
 * Easing - The style in which the transition from the previous to
 * the new camera occurs over time. Defaults to Linear.
 */
export declare type CameraTransitionOptions = {
    delay?: number;
    duration?: number;
    easing?: Easing;
};
/**
 * Available options when applying an orbit camera.
 *
 * @remarks
 *
 * Type Parameters:
 *
 * distance - (number) The distance from the target to the camera. If not set,
 * the camera remains at its current distance. Default = 5.0
 *
 */
export declare type OrbitCameraOptions = {
    distance?: number;
};
/**
 * Available options when applying a pan camera.
 *
 * @remarks
 *
 * Type Parameters:
 *
 * positionOffset - (number) The distance from the target to the camera. If not set,
 * the camera remains at its current distance. Default = 5.0
 *
 * translationSpeed - Controls how quickly the camera moves with the
 * target it's attached to. If not set, the camera is always snapped
 * to the position offset from the target.
 */
export declare type PanCameraOptions = {
    positionOffset?: Vec3;
    translationSpeed?: number;
};
/**
 * The available options to apply when activating a fixed camera.
 *
 * @remarks
 *
 * Type Parameters:
 *
 * position - (Vec3) The position in world space to set the camera to.
 * If not set, the camera will maintain it's current position.
 *
 * rotation - The rotation for the camera to face. If not set, the
 * camera maintains its current rotation.
 */
export declare type FixedCameraOptions = {
    position?: Vec3;
    rotation?: Quaternion;
};
/**
 * Options used to determine the bahavior of a camera in {@link Camera.setCameraModeAttach | attached mode}.
 *
 * @remarks
 *
 * Type Parameters:
 *
 * A camera in attached mode is locked to a position relative to the target's
 * position, with a rotation relative to the target's rotation.
 *
 * `positionOffset` - The local space offset relative to the target.
 * If not set, the camera is attached directly to the target's position.
 *
 * `rotationOffset` - The local space rotation relative to the target.
 * If not set, the camera faces the same direction as the target.
 *
 * `translationSpeed` - Controls how quickly the camera moves with the
 * target it's attached to. If not set, the camera is always snapped
 * to the position offset from the target.
 *
 * `rotationSpeed` - Controls how quickly the camera rotates to keep the
 * target in view. If not set, the camera always points in the same
 * direction the target is facing.
 */
export declare type AttachCameraOptions = {
    positionOffset?: Vec3;
    rotationOffset?: Vec3 | Quaternion;
    translationSpeed?: number;
    rotationSpeed?: number;
};
/**
 * The camera target type used by a camera in {@link Camera.setCameraModeAttach | attached mode}.
 */
export declare type CameraTarget = Entity | Player;
/**
 * The in-game camera.
 */
export declare class Camera {
    /**
     * The type of camera that is active.
     *
     * @remarks For native cameras, this propety indicates
     * whether the camera is in first or third person mode.
     */
    currentMode: ReadableHorizonProperty<CameraMode>;
    /**
     * The camera roll angle.
     *
     * @remarks
     * You can change this value over time using {@link setCameraRollWithOptions}.
     */
    cameraRoll: HorizonProperty<number>;
    /**
     * Indicates whether camera collision is enabled.
     */
    collisionEnabled: HorizonProperty<boolean>;
    /**
     * Indicates whether the player is allowed to toggle between first and third person modes.
     *
     * @remarks
     * This property does not affect a script's ability to forcibly enable 1st or 3rd person mode
     * with {@link Camera.SetCameraModeFirstPerson} or {@link Camera.SetCameraModeThirdPerson}. This property
     * has as no effect in VR, where first person is always enabled.
     *
     * @example
     * ```
     * if (LocalCamera !== null) {
     *   LocalCamera.position.get()
     * }
     * ```
     */
    perspectiveSwitchingEnabled: HorizonProperty<boolean>;
    /**
     * Gets the position of the camera.
     *
     * @example
     * ```
     * if (LocalCamera !== null) {
     *   LocalCamera.position.get()
     * }
     * ```
     */
    position: ReadableHorizonProperty<Vec3>;
    /**
     * Gets the rotation of the camera.
     *
     * @example
     * ```
     * if (LocalCamera !== null) {
     *   LocalCamera.rotation.get()
     * }
     * ```
     */
    rotation: ReadableHorizonProperty<Quaternion>;
    /**
     * Gets the forward direction of the camera.
     *
     * @example
     * ```
     * if (LocalCamera !== null) {
     *   LocalCamera.forward.get()
     * }
     * ```
     */
    forward: ReadableHorizonProperty<Vec3>;
    /**
     * Gets the up direction of the camera.
     *
     * @example
     * ```
     * if (LocalCamera !== null) {
     *   LocalCamera.up.get()
     * }
     * ```
     */
    up: ReadableHorizonProperty<Vec3>;
    /**
     * Gets the world space position that first intersects the center of the camera
     * view, ignoring the avatar of the local player.
     *
     * @example
     * ```
     * if (LocalCamera !== null) {
     *   var lookAtPosition = LocalCamera.lookAtPosition.get();
     * }
     * ```
     */
    lookAtPosition: ReadableHorizonProperty<Vec3>;
    /**
     * Sets the current camera to a fixed world position and rotation.
     *
     * @param options - If not set, the camera remains fixed in place from it's current position and orientation.
     *
     * @example Move the camera to a new position over a period of 1 second, maintaining its current orientation.
     * ```
     * localCamera.setFixedCameraPosition({position: pos}, {duration: 1.0});
     * ```
     * @example Keep the camera where it currently is, but point it straight downwards instantly.
     * ```
     * localCamera.setFixedCameraPosition({lookAt: getCameraPos() + new Vec3(0,-1,0)});
     * ```
     * @public
     */
    setCameraModeFixed(options?: FixedCameraOptions & CameraTransitionOptions): Promise<CameraTransitionEndReason>;
    /**
     * Enables attach mode for a camera, which automatically follows a target entity's position and rotation.
     *
     * @param target - The entity for the tracking camera to follow.
     * @param options - If not set, the camera instantly matches the target's position and rotation.
     *
     * @remarks
     * If the target entity is destroyed, camera tracking stops with the camera remaining where it was
     * before losing the target. This method has no effect in VR, where only first person cameras are
     * permitted.
     *
     * @example Place the camera at a fixed position relative to the player, over a period of 1 second.
     * ```
     * localCamera.setCameraModeAttach(player, {positionOffset = position, duration: 1.0});
     * ```
     * @public
     */
    setCameraModeAttach(target: CameraTarget, options?: AttachCameraOptions & CameraTransitionOptions): Promise<CameraTransitionEndReason>;
    /**
     * Enables the standard third-person game camera, which follows the local player avatar.
     *
     * @param options - Optional properties that define how the previous camera should transition
     * to this new camera. If not set, the transition is instant.
     *
     * @remarks
     * Disables any previously set camera, ignores the current value of
     * {@link Camera.perspectiveSwitchingEnabled}, and has no effect in VR
     * where only first person is allowed.
     *
     * @example Enable the third person over a period of 1 second.
     * ```
     * localCamera.setCameraModeThirdPerson({duration: 1.0});
     * ```
     * @public
     */
    setCameraModeThirdPerson(options?: CameraTransitionOptions): Promise<CameraTransitionEndReason>;
    /**
     * Enables the standard first person game camera, which follows the local player avatar.
     *
     * @param options - Optional properties that define how the previous camera should
     * transition to this new camera. If not set, the transition is instant.
     *
     * @remarks
     * Disables any previously set camera. Ignores the current value of
     * {@link Camera.perspectiveSwitchingEnabled}. Has no effect in VR, where first person is
     * always enabled.
     *
     * @example Enable the first person camera after a delay of 1 second.
     * ```
     * localCamera.setCameraModeFirstPerson({delay: 1.0});
     * ```
     * @public
     */
    setCameraModeFirstPerson(options?: CameraTransitionOptions): Promise<CameraTransitionEndReason>;
    /**
     * Enables the orbit camera, which follows the local player avatar.
     *
     * @param options - Optional properties that define how the previous camera should
     * transition to this new camera. If not set, the transition is instant.
     *
     * @remarks
     * Disables any previously set camera. Ignores the current value of
     * {@link perspectiveSwitchingEnabled}. and has no effect in VR
     * where only first person is allowed.
     *
     * @example Enable the orbit camera after a delay of 1 second.
     * ```
     * localCamera.setCameraModeOrbit({delay: 1.0});
     * ```
     * @public
     */
    setCameraModeOrbit(options?: OrbitCameraOptions & CameraTransitionOptions): Promise<CameraTransitionEndReason>;
    /**
     * Enables the pan camera, which follows the local player avatar at a fixed vector offset.
     *
     * @param options - Optional properties that define how the previous camera should
     * transition to this new camera. If not set, the transition is instant.
     *
     * @remarks
     * Disables any previously set camera. Ignores the current value of
     * {@link perspectiveSwitchingEnabled}. and has no effect in VR
     * where only first person is allowed.
     *
     * @example Enable the pan camera after a delay of 1 second.
     * ```
     * localCamera.setCameraModePan({delay: 1.0});
     * ```
     * @public
     */
    setCameraModePan(options?: PanCameraOptions & CameraTransitionOptions): Promise<CameraTransitionEndReason>;
    /**
     * Set the field of view of the camera.
     *
     * @param fov - The new field of view value to transition towards.
     * @param options - Optional properties that define how the previous field of view
     * should transition to the new one. If not set, the transition is instant.
     *
     * @remarks
     * Prevents the native camera from adjusting the field of view automatically, until
     * {@link Camera.resetCameraFOV} is called. For example, the third person camera zooms in a
     * little while you sprint.
     *
     * @example Adjust the camera field of view to 50 over a period of 1 second.
     * ```
     * localCamera.overrideCameraFOV(50.0, {duration: 1.0);
     * ```
     * @public
     */
    overrideCameraFOV(fov: number, options?: CameraTransitionOptions): Promise<CameraTransitionEndReason>;
    /**
     * Clears any field of view override, resetting it to the default native camera value.
     *
     * @param options - Optional properties that define how the previous field of view
     * should transition to the new field of view. If not set, the transition is instant.
     *
     * @remarks
     * Prevents the native camera from adjusting the field of view automatically until
     * {@link Camera.resetCameraFOV} is called. For example, the third person camera zooms in
     * a little while the player sprints.
     *
     * @example Reset the field of view over a period of 1 second.
     * ```
     * localCamera.resetCameraFOV({duration: 1.0);
     * ```
     * @public
     */
    resetCameraFOV(options?: CameraTransitionOptions): Promise<CameraTransitionEndReason>;
    /**
     * Adjusts the current camera roll over time.
     *
     * @param rollAngle - The roll rotation, in degrees, to set on the the current camera.
     * @param options - Optional properties that define how the previous roll should
     * transition to the new roll. If not set, the transition is instant.
     *
     * @example Roll the camera by 10 degrees left over 1 second.
     * ```
     * localCamera.setCameraRoll(-10, {duration: 1.0});
     * ```
     * @public
     */
    setCameraRollWithOptions(rollAngle: number, options?: CameraTransitionOptions): Promise<CameraTransitionEndReason>;
}
/**
 * Global camera instance.
 */
declare const LocalCamera: Camera;
export default LocalCamera;

}