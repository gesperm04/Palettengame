// Mutable, non-reactive input state written by touch controls and read every
// frame by the character/camera/interaction systems. Kept outside React state
// so high-frequency joystick/swipe updates never trigger re-renders.
export const inputState = {
  moveX: 0,
  moveZ: 0,
  cameraYawDelta: 0,
  cameraPitchDelta: 0,
  actionRequested: false,
}

export function consumeAction(): boolean {
  if (inputState.actionRequested) {
    inputState.actionRequested = false
    return true
  }
  return false
}
