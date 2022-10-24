<script lang="ts" setup>
  import ComponentList from './components/component-list.vue'
  import ComponentCanvas from './components/component-canvas.vue'
  import ComponentConf from './components/component-configuration.vue'

  import Operate from './components/Operate.vue'

</script>

<template>
  <el-container class="relative w-screen h-screen overflow-hidden">
    <el-header class="border-b border-black">
      <Operate />
    </el-header>
    <el-container>
      <el-aside width="300px">
        <ComponentList />
      </el-aside>
      <el-main style="padding: 0">
        <ComponentCanvas></ComponentCanvas>
      </el-main>
      <el-aside width="300px">
        <ComponentConf />
      </el-aside>
    </el-container>
  </el-container>
</template>

<route lang="yaml">
name: FormEditor
meta:
  layout: default
</route>