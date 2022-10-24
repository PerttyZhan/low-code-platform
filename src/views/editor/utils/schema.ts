import {
  get, isFunction, isString, set, flow,
  cloneDeep, each,
  transform as objTrans, omit,
  defaultTo,
  isPlainObject
} from 'lodash'
import { merge } from './merge'

import FormEditor from './form-editor'
import VantSchema from './vant'

const pipeConfig: Record<string, any> = {} // 管道处理
const cachedSchema: Record<string, any> = {} // 缓存处理过的schema

export const addPipe = (key: string, callback: Function): void => {
  if (!pipeConfig[key]) {
    pipeConfig[key] = []
  }
  pipeConfig[key].push(callback)
}

export const addStartGeneralPipe = (callback: Function): void => {
  callback && addPipe('start', callback)
}

export const addEndGeneralPipe = (callback: Function): void => {
  callback && addPipe('end', callback)
}

export const getCachedSchema = (key: string) => {
  return cachedSchema[key]
}

export const setBaseProperty = (schema: any, field: string, value: any) => {
  const source = cloneDeep(schema)
  const fieldSchema = get(source.baseProperty, `field.${field}.field`)
  set(source.baseProperty, `field.${field}.field`, merge(fieldSchema, value))
  return source
}

export const transform = (componentConstructor: any) => {
  const name = get(componentConstructor, 'name')
  if (cachedSchema[name]) {
    return cachedSchema[name]
  }
  const commonTransform = pipeConfig['start'] || []
  const componentTransform = pipeConfig[name] || []
  const endTransform = pipeConfig['end'] || []
  const schema = flow(
    ...commonTransform,
    ...componentTransform,
    ...endTransform,
  )(
    componentConstructor
  )
  cachedSchema[name] = schema
  return schema
}

const ExpRE = /^\s*\{\{(.*)\}\}\s*$/

export const complieExpression = (source: any, context: any) => {
  const keys = Object.keys(context);
  const values = Object.values(context);
  const complie = (source: any) => {
    if(isString(source)) {
      const matched = source.match(ExpRE);
      if(!matched) {
        return source;
      }
      return new Function(...keys, `try { return (${matched[1]}); }catch(e){ console.log(e); return false; }`)(...values);
    } else if(isPlainObject(source)) { 
      for(let key in source) {
        source[key] = complie(source[key]);
      }
    } else if(isFunction(source)) {
      return source;
    }
    return source;
  }
  return complie(source);
}


export const compile = (source: any, context: any) => {
  const schema = cloneDeep(source)
  const obj: Record<any, string> = Object.assign({}, omit(source, ['baseProperty', 'componentProperty', 'componentSlots']))
  const visit = (source: any): any => {
    if (source.field) {
      return objTrans(source.field, (result: any, value: string, key: string) => {
        if (value) {
          result[key] = visit(value)
        }
      }, {})
    }
    const value = complieExpression(defaultTo(source.value, source.default), context)
    // if (
    //   isFunction(value) && 
    //   (source.type !== 'function' || !source.type.includes('function'))
    // ) {
    //   return value()
    // }
    return value
  }
  obj.baseProperty = visit(schema.baseProperty)
  obj.componentProperty = visit(schema.componentProperty)
  obj.componentSlots = visit(schema.componentSlots)

  return obj
}

const importComponentFormat = () => {
  const formats = [
    FormEditor,
    VantSchema
  ]
  each(formats, (config: any) => {
    const commons = omit(config, ['start', 'end'])
    each(commons, (value: any, key: string) => addPipe(key, value))
    addStartGeneralPipe(config.start)
    addEndGeneralPipe(config.end)
  })
}

importComponentFormat()