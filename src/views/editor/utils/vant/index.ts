import { merge } from '../merge'

export default {
  'van-button': (config: any) => {
    return merge(config, {
      title: '按钮',
      baseProperty: {
        field: {
          size: {
            field: {
              width: { default: '100' },
              height: { default: '32' }
            }
          }
        }
      },
      componentProperty: {
        field: {
          type: { default: 'default' },
          size: { default: 'normal' },
          icon: { default: 'van-icon' },
        }
      },
      componentSlots: {
        field: {
          default: { title: '默认插槽', default: () => '测试' }
        }
      }
    })
  },
  'van-cell': (config: any) => {
    const cfg = merge(config, {
      title: '单元格',
      baseProperty: {
        field: {
          position: {
            x: { default: 0 },
          },
          size: {
            field: {
              width: { default: '{{canvas.size.width}}' },
              height: { default: '44' },
            }
          }
        }
      },
      componentProperty: {
        field: {
          title: { default: '单元格' },
          value: { default: '内容' }
        }
      }
    })
    return cfg
  },
  'van-field': (config: any) => {
    return merge(config, {
      title: '输入框',
      baseProperty: {
        field: {
          size: {
            field: {
              width: { default: '400' },
              height: { default: '48' }
            }
          }
        }
      },
      componentProperty: {
        field: {
          label: { default: '标题' },
          placeholder: { default: '请输入' },
          type: { default: 'text' }
        }
      },
      componentSlots: {
        field: {
          default: { title: '默认插槽', default: () => '测试' }
        }
      }
    })
  }
}