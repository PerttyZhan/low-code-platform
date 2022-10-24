import { get } from 'lodash'
import type { ComponentInternalInstance } from 'vue'
import { userEditorStore } from '@/store/editor.store'

export default defineComponent({
  name: 'CanvasBox',
  inheritAttrs: false,
  props: {
    name: String,
    componentProperty: Object,
    componentSlots: Object
  },
  setup (props: any) {
    const editorStore = userEditorStore()
    const componentConfig = editorStore.getComponentConfig(props.name)
    return () => h(componentConfig, {
      // class: 'w-full h-full',
      style: {width: '100%', height: '100%'},
      ...props.componentProperty
    }, props.componentSlots)
  }
})