'use client'

import { useEffect } from 'react'

/**
 * Multiple overlays (drawers, search, preloader) each need to lock page
 * scroll while open. If each one independently sets/resets
 * document.body.style.overflow, closing one while another is still open
 * wrongly re-enables scroll. This keeps a shared reference count so the
 * body only unlocks once every lock has been released.
 */
let lockCount = 0

function lock() {
  lockCount += 1
  document.body.style.overflow = 'hidden'
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    document.body.style.overflow = ''
  }
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    lock()
    return unlock
  }, [active])
}
