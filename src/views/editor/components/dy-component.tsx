import { get } from 'lodash'
import { transform } from '../utils/schema'
import { userEditorStore } from '@/store/editor.store'


export default defineComponent({
  name: 'DyComponent',
  props: {
    name: String
  },
  setup (props) {
    const { name } = props
    const editorStore = userEditorStore()
    const componentConfig = editorStore.getComponentConfig(name)
    const componentSchema: any = transform(componentConfig)
    return () => (
      <div
        class="w-33% py-2 text-center border border-black mr-2 mb-4"
        draggable
        data-component={name}
      >
        {componentSchema.title || '未知'}
      </div>
    )
  }
})