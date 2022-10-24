import { getCurrentInstance, type ComponentInternalInstance } from 'vue'

export const getGlobalProperty = (key: string): any => {
  // 在setup函数中获取实例对象并定义bus
  const instance: ComponentInternalInstance = getCurrentInstance() as ComponentInternalInstance
  return instance.appContext.config.globalProperties[key]
}