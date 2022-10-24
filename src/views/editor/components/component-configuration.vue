<script lang="ts" setup>
  import BaseProperty from './configuration/base-property.vue'
  import ComponentProperty from './configuration/component-property.vue'

  import type { Ref } from 'vue'
  import { userEditorStore } from '@/store/editor.store'
  const activeName: Ref<string> = ref('first')
  const editorStore = userEditorStore()
  const nowComponent = computed(() => editorStore.activeComponent)
  const baseConfig = computed(() => nowComponent.value?.baseProperty)
  const componentConfig = computed(() => nowComponent.value?.componentProperty)
</script>

<template>
  <div class="w-full h-full border-l overflow overflow-y-auto border-black">
    <el-tabs v-model="activeName">
      <el-tab-pane lazy label="基础属性" name="first">
        <BaseProperty v-if="nowComponent" :property="baseConfig" />
      </el-tab-pane>
      <el-tab-pane lazy label="组件属性" name="second">
        <ComponentProperty v-if="nowComponent" :property="componentConfig" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>