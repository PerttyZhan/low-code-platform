import { computed } from 'vue'

export default (CanvasBox) => {
  return defineComponent({
    name: 'SizeBox',
    inheritAttrs: false,
    props: {
      baseProperty: Object
    },
    setup(props) {
      const sty = computed(() => {
        const property = props.baseProperty
        return {
          width: property.size.width + 'px',
          height: property.size.height + 'px'
        }
      })
      const attrs = useAttrs()
      const slots = useSlots()
      const renderBox = () => h(CanvasBox, {
        ...attrs,
        ...props
      }, slots)
      return () => {
        return (
          <div style={sty.value}>
            { renderBox() }
          </div>
        )
      }
    }
  })
}