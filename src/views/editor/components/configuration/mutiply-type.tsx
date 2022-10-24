import { defineComponent } from 'vue'
import { typeString } from '../../utils'

export default defineComponent({
  name: 'MutiplySchemaType',
  props: ['type', 'defaultValue'],
  setup (props, { emit }) {
    const initSelect = ref('')
    const fileValue = reactive({default: ''})
    const inputValue = computed(() => {
      return fileValue[initSelect.value] || fileValue.default
    })
    const setValue = (value) => {
      fileValue[initSelect.value] = value
    }
    
    watch(
      () => inputValue.value,
      (newV) => {
        emit('change', newV)
      }
    )

    watch(
      () => props.defaultValue,
      (newV) => {
        if (newV) {
          const typestr = typeString(newV)
          initSelect.value = typestr
          if (typestr === 'function') {
            fileValue[typestr] = newV.toString()
          } else {
            fileValue[typestr] = newV
          }
        }
      },
      { immediate: true }
    )
    
    return () => (
      <div class='w-full'>
        <el-input
          placeholder='请输入'
          modelValue={inputValue.value}
          onInput={setValue}
          v-slots={
            {
              prepend: () =>
                (
                  <el-select
                    modelValue={initSelect.value}
                    onChange={value => initSelect.value = value }
                    placeholder="请选择"
                    style="width: 80px"
                  >
                    {
                      get(props, 'type', []).map(key => (
                        <el-option label={key} value={key} />
                      ))
                    }
                  </el-select>
                )
            }
          }
        >
        </el-input>
      </div>
    )
  }
})