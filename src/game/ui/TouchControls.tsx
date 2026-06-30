import { CameraSwipeZone } from '@/game/ui/CameraSwipeZone'
import { Joystick } from '@/game/ui/Joystick'
import { ActionButton } from '@/game/ui/ActionButton'

export function TouchControls() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="pointer-events-auto absolute inset-0">
        <CameraSwipeZone />
      </div>
      <div className="pointer-events-auto">
        <Joystick />
      </div>
      <div className="pointer-events-auto">
        <ActionButton />
      </div>
    </div>
  )
}
