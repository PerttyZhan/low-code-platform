import { useDraggable } from '@vueuse/core'
import { get } from 'lodash'
import { getGlobalProperty } from '../../utils/app'

export default defineComponent({
  name: 'Dropable',
  inheritAttrs: false,
  props: {
    shape: Object,
    canvasConfig: Object,
    active: Boolean
  },
  setup(props, { emit }) {
    const $bus = getGlobalProperty('$bus')
    const activeSty = computed(() => {
      const shape = props.shape
      const width = get(shape, 'width')
      const height = get(shape, 'height')
      return {
        width: width ?  `${+width + 4}px` : '100%',
        height: height ? `${+height + 4}px` : '100%',
        top: '-2px',
        left: '-2px'
      }
    })

    const handlerMouseDown = (direction: string) => {
      return (downEvent: MouseEvent) => {
        downEvent.stopPropagation()
        downEvent.preventDefault()
        
        let preX = downEvent.clientX
        let preY = downEvent.clientY

        // 是否需要保存快照
        let needSave = false
        const move = (moveEvent: MouseEvent) => {
          downEvent.stopPropagation()
          downEvent.preventDefault()
          needSave = true
          const currX = moveEvent.clientX
          const currY = moveEvent.clientY
          const distanceX = currX - preX
          const distanceY = currY - preY

          const { width, height, x, y } = props.shape
          let newWidth = Number(width)
          let newHeight = Number(height)
          let posX = Number(x)
          let posY = Number(y)

          if (direction === 'TOP') {
            posY = posY + distanceY
            newHeight = newHeight + distanceY * -1
          } else if (direction === 'TOPLEFT') {
            posX = posX + distanceX
            posY = posY + distanceY
            newWidth = newWidth + distanceX * -1
            newHeight = newHeight + distanceY * -1
          } else if (direction === 'TOPRIGHT') {
            newWidth = newWidth + distanceX
            newHeight = newHeight + distanceY
          } else if (direction === 'LEFT') {
            posX = posX + distanceX
            newWidth = newWidth + distanceX * -1
          } else if (direction === 'RIGHT') {
            newWidth = newWidth + distanceX
          } else if (direction === 'BOTTOMLEFT') {
            posX = posX + distanceX
            newWidth = newWidth + distanceX * -1
            newHeight = newHeight + distanceY
          } else if (direction === 'BOTTOM') {
            newHeight = newHeight + distanceY
          } else if (direction === 'BOTTOMRIGHT') {
            newWidth = newWidth + distanceX
            newHeight = newHeight + distanceY
          }
          emit('change', newWidth, 'width')
          emit('change', newHeight, 'height')
          emit('change', posX, 'x')
          emit('change', posY, 'y')
          $bus.emit('move')
          
          // 替换之前的值
          preX = currX
          preY = currY
        }
        const up = () => {
          document.removeEventListener('mousemove', move)
          document.removeEventListener('mouseup', up)
          $bus.emit('move-end')
        }
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
      }
    }

    const el = ref(null)
    const slots = useSlots()
    useDraggable(el, {
      onStart () {
        $bus.emit('move-start')
      },
      onMove (pos) {
        const { offset } = props.canvasConfig
        emit('change', pos.x - offset.x, 'x')
        emit('change', pos.y - offset.y, 'y')
        $bus.emit('move')
      },
      onEnd () {
        $bus.emit('move-end')
      }
    })

    return () => {
      return (
        <div class='relative w-full h-full cursor-move'>
          <div ref={el} class='relative w-full h-full z-11'>
            {slots.default()}
          </div>
          <div style={activeSty.value} class='absolute left-0 top-0 w-full h-full z-10'>
            {
              props.active
                ? (
                    <div class='relative w-full h-full border border border-panelTitle'>
                      <div
                        onMousedown={handlerMouseDown('TOPLEFT')}
                        class='absolute rd-4px left--2px top--2px w-8px h-8px border border-panelTitle cursor-nw-resize z-11'
                      ></div>
                      <div
                        onMousedown={handlerMouseDown('TOP')}
                        class='absolute rd-8px left-50% top--4px w-8px h-8px border border-panelTitle cursor-n-resize z-11'
                      ></div>
                      <div
                        onMousedown={handlerMouseDown('TOPRIGHT')}
                        class='absolute rd-8px right--4px top--4px w-8px h-8px border border-panelTitle cursor-ne-resize z-11'
                      ></div>

                      <div
                        onMousedown={handlerMouseDown('BOTTOMLEFT')}
                        class='absolute rd-8px left--4px bottom--4px w-8px h-8px border border-panelTitle cursor-sw-resize z-11'
                      ></div>
                      <div
                        onMousedown={handlerMouseDown('BOTTOM')}
                        class='absolute rd-8px left-50% bottom--4px w-8px h-8px border border-panelTitle cursor-s-resize z-11'
                      ></div>
                      <div
                        onMousedown={handlerMouseDown('BOTTOMRIGHT')}
                        class='absolute rd-8px right--4px bottom--4px w-8px h-8px border border-panelTitle cursor-se-resize z-11'
                      ></div>

                      <div
                        onMousedown={handlerMouseDown('LEFT')}
                        class='vertical-center rd-8px left--4px w-8px h-8px border border-panelTitle cursor-w-resize z-11'
                      ></div>

                      <div
                        onMousedown={handlerMouseDown('RIGHT')}
                        class='vertical-center rd-8px right--4px w-8px h-8px border border-panelTitle cursor-e-resize z-11'
                      ></div>
                    </div>
                  )
              : null
            }
          </div>
          
        </div>
      )
    }
  }
})