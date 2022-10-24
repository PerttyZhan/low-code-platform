<script lang="ts" setup>
  import { 
    filter, each, debounce,
    flow, head, reduce,
  } from 'lodash'
  import { boundCoord } from '../utils/element'
  import { createUUid } from '../utils/uuid'
  import { defineEmits } from 'vue'
  import { getGlobalProperty } from '../utils/app'


  interface Props {
    components: any[],
    canvasConfig: any
  }

  // // 出现标线的临界值
  const lines = reactive({
    diff: 5,
    options: [
      {
        id: createUUid(),
        key: 'xt',
        status: false
      },
      {
        id: createUUid(),
        key: 'xc',
        status: false
      },
      {
        id: createUUid(),
        key: 'xb',
        status: false
      },
      {
        id: createUUid(),
        key: 'yl',
        status: false
      },
      {
        id: createUUid(),
        key: 'yc',
        status: false
      },
      {
        id: createUUid(),
        key: 'yr',
        status: false
      },
    ]
  })
  const $bus = getGlobalProperty('$bus')
  const props = withDefaults(defineProps<Props>(), {
    components: [],
    canvasConfig: {}
  })
  const canvasConfig = computed(() => props.canvasConfig)
  const emits = defineEmits(['change'])

  const isNearly = (start: number, end: number) => {
    return Math.abs(start - end) <= lines.diff
  }
  const mostNear = (target: number, ...coords: number[]): any => {
    const mostCoor = {
      coor: null,
      distance: Number.MAX_SAFE_INTEGER
    }
    each(coords, coord => {
      const distance = Math.abs(coord - target)
      if (mostCoor.distance > distance) {
        mostCoor.coor = coord
        mostCoor.distance = distance
      }
    })
    return mostCoor
  }

  const debounceUpdate = debounce((value, path) =>{
    emits('change', value, path)
  }, 20)

  const showLine = () => {
    const activeComponent = flow(
      arr => filter(arr, item => item.active),
      head
    )(props.components)
    if (!activeComponent) return
    const { position, size: activeSize } = activeComponent.baseProperty
    const otherComponents = filter(props.components, (item: any) => !item.active)
    const activeCoord = boundCoord(position?.x, position?.y, activeSize?.width, activeSize?.height)
    const mapLine = reduce(lines.options, (obj, value) => {
      value.status = false // 每次移动，都先隐藏
      value.id = createUUid()
      obj[value.key] = value
      return obj
    }, {})
    const updateVals = []
    const updateFields = []
    
    const canvasCoord = boundCoord(0, 0, canvasConfig.value.size.width, canvasConfig.value.size.height)
    if (
      isNearly(activeCoord.x, canvasCoord.x) ||
      isNearly(activeCoord.x, canvasCoord.x1)
    ) {
      const nearCoord = mostNear(activeCoord.x, canvasCoord.x, canvasCoord.x1)
      mapLine['yl'].status = true
      mapLine['yl'].left = nearCoord.coor
      updateVals.push(nearCoord.coor)
      updateFields.push('baseProperty.field.position.field.x')
    } else if (
      isNearly(activeCoord.x1, canvasCoord.x1)
    ) {
      mapLine['yc'].status = true
      mapLine['yc'].left = canvasCoord.x1
      updateVals.push(canvasCoord.x1 - activeSize.width / 2)
      updateFields.push('baseProperty.field.position.field.x')
    }

    each(otherComponents, config => {
      const { baseProperty: { position, size } } = config
      const coord = boundCoord(position.x, position.y, size.width, size.height)
      if (
        isNearly(activeCoord.x, coord.x) ||
        isNearly(activeCoord.x, coord.x1) ||
        isNearly(activeCoord.x, coord.x2)
      ) {
        const nearCoord = mostNear(activeCoord.x, coord.x, coord.x1, coord.x2)
        mapLine['yl'].status = true
        mapLine['yl'].left = nearCoord.coor
        updateVals.push(nearCoord.coor)
        updateFields.push('baseProperty.field.position.field.x')
      }
      if (
        isNearly(activeCoord.x1, coord.x1)
      ) {
        mapLine['yc'].status = true
        mapLine['yc'].left = coord.x1
        updateVals.push(coord.x1 - activeSize.width / 2)
        updateFields.push('baseProperty.field.position.field.x')
      }
      if (
        isNearly(activeCoord.x2, coord.x) ||
        isNearly(activeCoord.x2, coord.x1) ||
        isNearly(activeCoord.x2, coord.x2)
      ) {
        const nearCoord = mostNear(activeCoord.x2, coord.x, coord.x1, coord.x2)
        mapLine['yr'].status = true
        mapLine['yr'].left = nearCoord.coor
        updateVals.push(nearCoord.coor)
        updateFields.push('baseProperty.field.position.field.x')
      }
      if (
        isNearly(activeCoord.y, coord.y) ||
        isNearly(activeCoord.y, coord.y1) ||
        isNearly(activeCoord.y, coord.y2)
      ) {
        const nearCoord = mostNear(activeCoord.y, coord.y, coord.y1, coord.y2)
        mapLine['xt'].status = true
        mapLine['xt'].top = nearCoord.coor
        updateVals.push(nearCoord.coor)
        updateFields.push('baseProperty.field.position.field.y')
      }
      if (
        isNearly(activeCoord.y1, coord.y1)
      ) {
        mapLine['xc'].status = true
        mapLine['xc'].top = coord.y1 
        updateVals.push(coord.y1 - activeSize.height / 2)
        updateFields.push('baseProperty.field.position.field.y')
      }
      if (
        isNearly(activeCoord.y2, coord.y) ||
        isNearly(activeCoord.y2, coord.y1) ||
        isNearly(activeCoord.y2, coord.y2)
      ) {
        const nearCoord = mostNear(activeCoord.y2, coord.y, coord.y1, coord.y2)
        mapLine['xb'].status = true
        mapLine['xb'].top = nearCoord.coor
        updateVals.push(nearCoord.coor)
        updateFields.push('baseProperty.field.position.field.y')
      }
    })
    debounceUpdate(updateVals, updateFields)
  }
  const hideLine = () => {
    each(lines.options, line => {
      line.status = false
      line.top = 0
      line.left = 0
    })
  }

  $bus.on('move', () => {
    showLine()
  })
  $bus.on('move-end', () => {
    hideLine()
  })

</script>

<template>
  <div class="relative w-full h-full">
    <div
      v-for="line in lines.options"
      :key="line.id"
      :class="{
        'mark-line-item': true,
        'x-line': line.key.includes('x'),
        'y-line': line.key.includes('y'),
      }"
      :style="{
        display: line.status ? 'block' : 'none',
        left: line.key.includes('y') ? `${line.left || 0}px` : 0,
        top: line.key.includes('x') ? `${line.top || 0}px` : 0,
      }"
    >
    </div>
  </div>
</template>