<script lang="ts" setup>
  import { userEditorStore } from '@/store/editor.store'
  import { storeToRefs } from 'pinia'

  const editorStore = userEditorStore()
  const { componentLibrary, activeLib } = storeToRefs(editorStore)
  const updateActiveLibary = (libaryName: string) => {
    editorStore.setActiveLib(libaryName)
  }
</script>
<template>
  <div class="w-full py-14px">
    <div class="flex flex-row">
      <el-button>后退</el-button>
      <el-button>前进</el-button>
      <el-button>保存</el-button>
      <div class="block ml-2">
        <span class="mr-2">组件库</span>
        <el-select :modelValue="activeLib" @change="updateActiveLibary" placeholder="请选择组件库">
          <el-option v-for="lib in componentLibrary" :key="lib.name" :label="lib.name" :value="lib.name"></el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>