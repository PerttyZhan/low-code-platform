import { computed, ref } from 'vue'
import { debounce } from 'lodash'

import DropAble from './dropable'

export default (CanvasBox) => {
  return defineComponent({
    name: 'ShapeBox',
    inheritAttrs: false,
    props: {
      baseProperty: Object,
      canvasConfig: Object,
      active: Boolean
    },
    setup(props, { attrs, slots, emit }) {
      const el = ref<HTMLElement | null>(null)
      const shape = reactive({
        x: 0,
        y: 0,
        width: 0,
        height: 0
      })
      const sty: any = computed(() => {
        return {
          position: 'absolute',
          top: shape.y + 'px',
          left: shape.x + 'px',
          width: shape.width + 'px',
          height: shape.height + 'px'
        }
      })
      const debounceUpdate = debounce((value, path) =>{
        emit('change', value, path)
      }, 10)
      const updateState = (value: string, key: string) => {
        shape[key] = value
        debounceUpdate(
          [shape.x, shape.y, shape.width, shape.height],
          [
            'baseProperty.field.position.field.x',
            'baseProperty.field.position.field.y',
            'baseProperty.field.size.field.width',
            'baseProperty.field.size.field.height'
          ]
        )
      }
      const renderBox = () => h(CanvasBox, {
        ...attrs,
        ...props
      }, slots)

      watch(
        () => props.baseProperty,
        (newV) => {
          const { position: pos, size } = newV
          shape.x = pos.x 
          shape.y = pos.y
          shape.width = size.width
          shape.height = size.height
        },
        { deep: true, immediate: true }
      )

      return () => {
        return (
          <div ref={el} style={sty.value}>
            <DropAble
              active={props.active}
              shape={shape}
              canvasConfig={props.canvasConfig}
              onChange={updateState}
            >
              { renderBox() }
            </DropAble>
          </div>
        )
      }
    }
  })
}