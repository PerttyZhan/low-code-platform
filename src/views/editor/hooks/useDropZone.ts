import type { Ref, ComputedRef } from 'vue'
import { useEventListener } from '@vueuse/core'

export interface UseDropZoneReturn {
  isOverDropZone: Ref<boolean>
}

export default function useDropZone(
  target: ComputedRef<HTMLElement | null | undefined>,
  onDrop?: (event: DragEvent) => void,
): UseDropZoneReturn {
  const isOverDropZone = ref(false)
  let counter = 0

  useEventListener<DragEvent>(target, 'dragenter', (event) => {
    event.preventDefault()
    counter += 1
    isOverDropZone.value = true
  })
  useEventListener<DragEvent>(target, 'dragover', (event) => {
    event.preventDefault()
  })
  useEventListener<DragEvent>(target, 'dragleave', (event) => {
    event.preventDefault()
    counter -= 1
    if (counter === 0)
      isOverDropZone.value = false
  })
  useEventListener<DragEvent>(target, 'drop', (event) => {
    event.preventDefault()
    counter = 0
    isOverDropZone.value = false
    onDrop?.(event)
  })

  return {
    isOverDropZone,
  }
}