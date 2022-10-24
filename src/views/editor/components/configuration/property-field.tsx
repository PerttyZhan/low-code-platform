import { transform, debounce, isArray, defaultTo } from 'lodash'
import { defineEmits } from 'vue'
import MutiplySchemaType from './mutiply-type'

export default defineComponent({
  name: 'PropertyField',
  props: {
    fileSchema: Object
  },
  setup (props, { emit }) {
    const fileValue = reactive({})
    const emitChange = debounce((value, path) =>{
      emit('change', value, path)
    }, 50)
    const updateValue = (key, value) => {
      fileValue[key] = value
      emitChange(value, key)
    }

    const initValue = (schema: any, parentPath?: string) => {
      if (schema.field) {
        transform(schema.field, (_result, value, key: string) => {
          initValue({
            ...value,
            key
          }, parentPath ? `${parentPath}.field.${key}` : `field.${key}`)
        }, [])
      } else {
        fileValue[parentPath] = defaultTo(schema.value, schema.default)
      }
    }
    const render = (schema: any, parentPath?: string) => {
      const vNodes = []
      // if (schema.title) {
        vNodes.push(
          (
            <div class='w-full py-2 px-2'>
              {
                schema.key
                  ? (<span>{schema.key}</span>)
                  : null
              }
              {
                schema.title
                  ? (<span>({schema.title})</span>)
                  : null
              }
            </div>)
        )
      // }
      // if (schema.type === 'object') {
      //   schemaValue = schema.value || schema.default || {}
      // } else if (schema.type === 'string') {
      //   schemaValue = schema.value || schema.default || ''
      // }
      // if (schema.key) {
      //   parentState[schema.key] = schemaValue
      // }
      // schemaValue = schema.value || schema.default
      if (schema.field) {
        vNodes.push(
          ...transform(schema.field, (result, value, key: string) => {
            result.push(render({
              ...value,
              key
            }, parentPath ? `${parentPath}.field.${key}` : `field.${key}`))
          }, [])
        )
      } else {
        // console.log('schema.type===', schema.key, schema.type, fileValue[parentPath]);
        if (schema.type === 'boolean') {
          vNodes.push(
            (
              <el-select
                placeholder='请选择'
                modelValue={fileValue[parentPath]}
                onChange={value => updateValue(parentPath, value)}
              >
                <el-option label="true" value={true}></el-option>
                <el-option label="false" value={false}></el-option>
              </el-select>
            )
          )
        } else if (isArray(schema.type)) {
          vNodes.push(
            (
              <MutiplySchemaType
                type={schema.type}
                defaultValue={fileValue[parentPath]}
                onChange={value => updateValue(parentPath, value)}
              />
            )
          )
        } else if (schema.type === 'enum') {
          vNodes.push(
            (
              <el-select
                placeholder='请选择'
                modelValue={fileValue[parentPath]}
                onChange={value => updateValue(parentPath, value)}
              >
                {
                  map(schema.enums, item => (
                    <el-option label={item.label} value={item.value}></el-option>
                  ))
                }
              </el-select>
            )
          )
        } else {
          vNodes.push(
            (
              <div class='w-full'>
                <el-input
                  placeholder='请输入'
                  modelValue={fileValue[parentPath]}
                  onInput={value => updateValue(parentPath, value)}
                >
                </el-input>
              </div>
            )
          )
        }
      }
      return (
        <div class='w-full'>
          {vNodes}
        </div>
      )
    }

    watch(
      () => props.fileSchema,
      (newV) => {
        initValue(newV)
      },
      { deep: true, immediate: true }
    )

    return () => render(props.fileSchema)
  }
})