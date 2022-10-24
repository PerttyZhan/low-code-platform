import {
  filter, flow, head,
  each, isString, map,
  remove, set, values,
} from 'lodash'
import { defineStore } from 'pinia'
import { importLibary } from '@/views/editor/utils/script'
import { ElLoading } from 'element-plus'

export interface EditorConfig {
  canvasConfig: any,
  componentLibrary: any[],
  activeLib: string | null,
  componentList: any[],
  activeComponentId: any,
  components: any[],
  libraryLoading: boolean
}

export const userEditorStore = defineStore('editor', {
  state (): EditorConfig {
    return {
      canvasConfig: {
        size: {},
        offset: {}
      },
      libraryLoading: false,
      componentLibrary: [
        {
          name: 'vant',
          version: '3',
          label: '有赞移动端组件库',
          css: 'https://fastly.jsdelivr.net/npm/vant@3/lib/index.css',
          js: 'https://fastly.jsdelivr.net/npm/vant@3/lib/vant.min.js',
          modules: {},
          components: [
            {
              title: '基础组件',
              fields: [
                'van-button',
                'van-cell',
                'van-icon',
                'van-image'
              ]
            },
            {
              title: '表单组件',
              fields: [
                'van-calendar',
                'van-cascader',
                'van-cell',
                'van-cell-group',
                'van-form'
              ]
            }
          ]
        }
      ],
      activeLib: null,
      componentList: [],
      activeComponentId: null,
      components: []
    }
  },
  getters: {
    json (state) {
      return {
        ...state
      }
    },
    schemas (state) {
      return map(state.components, item => {
        return {
          ...item,
          active: item.id === state.activeComponentId
        }
      })
    },
    activeComponent (state) {
      const all = state.components
      const activeComponentId = state.activeComponentId
      return flow(
        arr => filter(arr, item => item.id === activeComponentId),
        head
      )(all)
    }
  },
  actions: {
    setActiveComponentId (id: string) {
      this.activeComponentId = id
    },
    delActiveComponent () {
      const { activeComponentId, components  } = this
      if (!activeComponentId) { return }
      const newComponents = remove(components, item => item.id !== activeComponentId)

      this.components = newComponents
      this.activeComponentId = null
    },
    addComponent (component: any) {
      this.components.push(component)
    },
    updateactiveSchema (path: string | string[], value: any) {
      const schema = flow(
        arr => filter(arr, item => item.id === this.activeComponentId),
        head
      )(this.components)
      const paths = isString(path) ? [path] : path
      const values = isString(value) ? [value] : value
      each(paths, (pth, index) => {
        set(schema, `${pth}.value`, values[index])
      })
    },
   async setActiveLib (libraryName: string) {
      const acticeLib = flow(
        arr => filter(arr, item => item.name === libraryName),
        head
      )(this.componentLibrary)
      if (acticeLib.loaded) {
        this.componentList = acticeLib.components || []
      } else {
        const loadingInstance = ElLoading.service({fullscreen: true})
        this.libraryLoading = true
        const [_style, lib] = await importLibary({
          js: acticeLib.js,
          css: acticeLib.css 
        })
        acticeLib.loaded = true
        acticeLib.modules = lib
        loadingInstance.close()
        this.libraryLoading = false
        this.componentList = acticeLib.components
      }
      this.activeLib = libraryName
    },
    getComponentConfig (componentName: string) {
      return flow(
        arr => filter(arr, item => item.name === this.activeLib),
        head,
        obj => obj.modules,
        values,
        arr => filter(arr, item => item.name === componentName),
        head
      )(this.componentLibrary)
    },
    updateCanavsConfig (keys: string[], values: string[]) {
      each(keys, (key, index) => {
        set(this.canvasConfig, key, values[index])
      })
    }
  }
})