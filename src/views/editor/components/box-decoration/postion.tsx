import { computed } from 'vue'
import { ref } from 'vue'

export default (CanvasBox) => {
  return defineComponent({
    name: 'PostionBox',
    inheritAttrs: false,
    props: {
      baseProperty: Object,
      canvasConfig: Object
    },
    setup(props, { attrs, slots, emit }) {
      const el = ref<HTMLElement | null>(null)
      const position = reactive({
        x: 0,
        y: 0
      })
      const sty = computed(() => {
        return {
          position: 'absolute',
          top: position.y + 'px',
          left: position.x + 'px'
        }
      },)
      const renderBox = () => h(CanvasBox, {
        ...attrs,
        ...props
      }, slots)

      watch(
        () => props.baseProperty,
        (newV) => {
          const { position: pos, size } = newV
          position.x = pos.x 
          position.y = pos.y
        },
        { deep: true, immediate: true }
      )

      return () => {
        return (
          <div ref={el} style={sty.value}>
            { renderBox() }
          </div>
        )
      }
    }
  })
}