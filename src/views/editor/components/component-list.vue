<script lang="ts" setup>
  import DyComponent from './dy-component'
  import { transform } from '../utils/schema'
  import { userEditorStore } from '@/store/editor.store'
  import { storeToRefs } from 'pinia'

  const editorStore = userEditorStore()
  const { componentList } = storeToRefs(editorStore)
  const { appContext } = getCurrentInstance()

  const handleDragStart = (e) => {
    const componentName = e.target.dataset.component
    transform(appContext.components[componentName])
    e.dataTransfer.setData('component', componentName)
  }
</script>

<template>
  <div class="w-full h-full border-r border-black">
    <div class="w-full pt-4 mt-2" @dragstart="handleDragStart">
      <div v-for="menu1 in componentList" class="w-full pb-4">
        <h4 class="w-full py-2 pl-4">{{menu1.title}}</h4>
        <div class="w-full pl-4 flex flex-row flex-wrap">
          <DyComponent
            v-for="componentName in menu1.fields"
              :key="componentName"
              :name="componentName"
            />
        </div>
      </div>

    </div>
  </div>
</template>