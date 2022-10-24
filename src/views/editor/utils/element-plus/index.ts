// addPipe('ElInput', (config: any) => {
//   config.componentProperty.field.inputStyle = null
//   config.componentProperty.field.id = null
//   config.componentProperty.field.modelValue = null
//   return merge(config, {
//     title: '输入框',
//     baseProperty: {
//       field: {
//         size: {
//           field: {
//             width: { default: '200' },
//             height: { default: '32' }
//           }
//         }
//       }
//     },
//     componentProperty: {
//       field: {
//         placeholder: { default: '请输入' }
//       }
//     }
//   })
// })

// addPipe('ElButton', (config: any) => {
//   // 暂时去除loadingIcon的设置
//   config.componentProperty.field.loadingIcon = null
//   return merge(config, {
//     title: '按钮',
//     baseProperty: {
//       field: {
//         size: {
//           field: {
//             width: { default: '100' },
//             height: { default: '32' }
//           }
//         }
//       }
//     },
//     componentProperty: {
//       field: {
//         plain: { default: false },
//         text: { default: false },
//         bg: { default: false },
//         link: { default: false },
//         round: { default: false },
//         circle: { default: false },
//         loading: { default: false },
//         disabled: { default: false },
//         autofocus: { default: false }
//       }
//     },
//     componentSlots: {
//       field: {
//         default: { title: '默认插槽', default: () => '测试' }
//       }
//     }
//   })
// })