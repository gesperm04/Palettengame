// Mobile browsers (especially iOS Safari) ignore `user-scalable=no` in the
// viewport meta tag and still trigger pinch-zoom and double-tap-zoom during
// gameplay touches. CSS `touch-action: none` alone is not always enough, so
// these gestures are intercepted directly at the document level.
let lastTouchEnd = 0

export function initPreventMobileZoom() {
  document.addEventListener('gesturestart', (e) => e.preventDefault())
  document.addEventListener('gesturechange', (e) => e.preventDefault())

  document.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length > 1) e.preventDefault()
    },
    { passive: false },
  )

  document.addEventListener(
    'touchend',
    (e) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) e.preventDefault()
      lastTouchEnd = now
    },
    { passive: false },
  )
}
