import {
  get, isFunction, isString, map,
  isArray, toLower, pickBy, pick
} from 'lodash'

const formatPropType = (obj: any): any => {
  if (isString(obj)) {
    return obj
  } else if (isArray(obj)) {
    return map(obj, formatPropType)
  } else if (isFunction(obj)) {
    return toLower(obj.name)
  } else {
    return 'unknown'
  }
}

const formatProps = (source: any): any => {
  const pickPropKeys = [
    'type', 'default', 'value',
    'label', 'description', 'enums'
  ]
  const target: any = {}
  
  for (let key in source) {
    const value = source[key]
    if (!value) continue 
    if (isFunction(value)) {
      target[key] = {
        type: toLower(value.name)
      }
    } else if (isArray(value)) {
      target[key] = {
        type: formatPropType(value)
      }
    } else {
      target[key] = {
        ...pick(source[key], pickPropKeys),
        type: formatPropType(value.type)
      }
    }
  }
  return target
}

export default {
  start (componentConfig: any) {
    const componentName = get(componentConfig, 'name')
    const ComponentProps = get(componentConfig, 'props')
    return {
      name: componentName,
      title: null,
      baseProperty: {
        type: 'object',
        title: '基础属性',
        field: {
          position: {
            type: 'object',
            title: '位置',
            field: {
              x: { type: 'string', default: '{{dropEvent.clientX - canvas.offset.x}}', title: '横坐标', value: null },
              y: { type: 'string', default: '{{dropEvent.clientY - canvas.offset.y}}', title: '纵坐标', value: null }
            }
          },
          size: {
            type: 'object',
            title: '大小',
            field: {
              width: { type: 'string', title: '宽度', default: null, value: null },
              height: { type: 'string', title: '高度', default: null, value: null }
            }
          }
        }
      },
      componentProperty: {
        type: 'object',
        description: '组件属性',
        field: formatProps(ComponentProps),
      },
      componentSlots: {
        type: 'object',
        description: '组件插槽'
      }
    }
  },
  end (componentConfig: any) {
    componentConfig.componentProperty.field = pickBy(componentConfig.componentProperty.field, (value) => {
      return value
    })
    return componentConfig
  }
}