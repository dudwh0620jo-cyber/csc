import { useRef, type PointerEvent } from 'react'

const swipeThreshold = 70
const swipeAxisRatio = 1.4

type SwipeGestureOptions = {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  shouldIgnoreSwipe?: (event: PointerEvent<HTMLElement>) => boolean
}

function useSwipeGesture({ onSwipeLeft, onSwipeRight, shouldIgnoreSwipe }: SwipeGestureOptions) {
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null)

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch' && event.pointerType !== 'pen') {
      return
    }

    if (shouldIgnoreSwipe?.(event)) {
      swipeStartRef.current = null
      return
    }

    swipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    }
  }

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!swipeStartRef.current) {
      return
    }

    const deltaX = event.clientX - swipeStartRef.current.x
    const deltaY = event.clientY - swipeStartRef.current.y

    swipeStartRef.current = null

    if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY) * swipeAxisRatio) {
      return
    }

    if (deltaX < 0) {
      onSwipeLeft?.()
      return
    }

    onSwipeRight?.()
  }

  return {
    onPointerCancel: () => {
      swipeStartRef.current = null
    },
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
  }
}

export default useSwipeGesture
