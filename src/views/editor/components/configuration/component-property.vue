<script lang="ts" setup>
  import { defineProps, withDefaults } from 'vue'
  import PropertyField from './property-field'
  import { userEditorStore } from '@/store/editor.store'

  interface Props {
    property: any
  }
  const props = withDefaults(defineProps<Props>(), {})
  const field = computed(() => props.property)
  const editorStore = userEditorStore()
  
  const updateSchemaValue = (value: string, path: string) => {
    editorStore.updateactiveSchema(`componentProperty.${path}`, value)
  }
</script>

<template>
  <div class="w-full h-full px-4 overflow-hidden overflow-y-auto">
    <PropertyField :fileSchema="field" @change="updateSchemaValue" />
  </div>
</template>