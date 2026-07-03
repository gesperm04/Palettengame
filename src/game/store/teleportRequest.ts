// One-shot teleport request consumed by the character controller's physics
// step. Needed because the RigidBody's transform is the source of truth for
// playerTransform (not the other way around), so UI code can't just mutate
// playerTransform directly to move the player.
let pendingTeleport: [number, number, number] | null = null

export function requestTeleport(position: [number, number, number]) {
  pendingTeleport = position
}

export function consumeTeleportRequest(): [number, number, number] | null {
  const value = pendingTeleport
  pendingTeleport = null
  return value
}
