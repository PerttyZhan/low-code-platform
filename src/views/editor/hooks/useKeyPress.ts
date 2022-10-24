import type { Ref, ComputedRef } from 'vue'
import { useEventListener } from '@vueuse/core'

export default function useKeyPress (
  target: ComputedRef<HTMLElement | null | undefined>,
  callback: Function,
  keyStr?: string
) {
  let cleanup = useEventListener(target, 'keyup', (event: KeyboardEvent) => {
    if (keyStr) {
      if (+keyStr === event.keyCode) {
        callback(event)
      }
    } else {
      callback(event)
    }
  })

  const cleanUp = () => {
    if (cleanup) {
      cleanup()
      cleanup = null
    }
  }

  // onUnmounted(() => {
  //   cleanUp()
  // })

  return cleanUp
}