<script lang="ts" setup>
  import useDropZone from '../hooks/useDropZone'
  import useKeyPress from '../hooks/useKeyPress'
  import { useElementSize } from '@vueuse/core'
  import { userEditorStore } from '@/store/editor.store'
  import { storeToRefs } from 'pinia'
  import { flow, map } from 'lodash'

  import CanvasBox from './canvas-box'
  import ShapeDecoration from './box-decoration/shape'
  import MarkLine from './mark-line.vue'
  import { getCachedSchema, compile } from '../utils/schema'
  import { elementOffset, getElementType } from '../utils/element'

  const DyComponent = flow(ShapeDecoration)(CanvasBox)

  const editorStore = userEditorStore()
  const { canvasConfig } = storeToRefs(editorStore)
  const DrogEventConfig = ref(null)
  const ConplieContext = computed(() => {
    const canvas = canvasConfig.value
    const dropEvent = DrogEventConfig.value
    return {
      canvas,
      dropEvent
    }
  })
  const components = computed(() => {
    return map(editorStore.schemas, schema => compile(schema, ConplieContext.value))
  })
  // const { activeComponentId } = storeToRefs(editorStore)
  const dropRef = ref<HTMLDivElement>()
  const { width, height } = useElementSize(dropRef)
  const handleDrop = async (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const componentName = event.dataTransfer.getData('component')
    
    DrogEventConfig.value = event
    const conponentSchema = getCachedSchema(componentName)
    conponentSchema['id'] = Math.random().toString(16).slice(2)
    conponentSchema['name'] = componentName
    editorStore.addComponent(conponentSchema)
    editorStore.setActiveComponentId(conponentSchema.id)
  }
  useDropZone(dropRef, handleDrop)
  const updateSchemaValue = (value: string, path: string) => {
    editorStore.updateactiveSchema(path, value)
  }
  const switchSelectComponent = (id) => {
    editorStore.setActiveComponentId(id)
  }
  const delActiveComponent = (event) => {
    const tagName = getElementType(event.target)
    if (tagName !== 'input') {
      editorStore.delActiveComponent()
    }
  }
  useKeyPress(document, delActiveComponent, 8)
  onMounted(() => {
    editorStore.updateCanavsConfig(['offset', 'size'], [
      elementOffset(dropRef.value),
      { width, height }
    ])
  })
</script>

<template>
  <div
    class="relative w-full h-full"
    ref="dropRef"
    @click="switchSelectComponent(null)"
  >
    <div
      v-for="cop in components"
      :key="cop.id"
      @click.stop="switchSelectComponent(cop.id)"
      @mousedown="switchSelectComponent(cop.id)"
    >
      <DyComponent
        :canvasConfig="canvasConfig"
        v-bind="cop"
        @change="updateSchemaValue"
      />
    </div>

    <mark-line
      :components="components"
      :canvasConfig="canvasConfig"
      @change="updateSchemaValue"
    />
  </div>
</template>