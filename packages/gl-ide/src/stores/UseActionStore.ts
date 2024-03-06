import { defineStore } from 'pinia'
import { Action, ComponentInstance, type IPropertySetterMeta } from '@geelato/gl-ui-schema'
import { useComponentBlockStore } from './UseComponentStore'

export type VarMeta = {
  // 变量名
  name: string
  // 值表达式
  label?: string
  // 描述
  remark?: string
}

/**
 *  打开当前动作编辑面板时，更新为当前的Action
 *  关闭动作编辑页面时，清空当前的Action
 */
export const useActionStore = defineStore({
  id: 'GlActionStore',
  state: () => ({
    action: new Action(),
    // varMeta
    vars: new Array<VarMeta>(),
    componentBlockStore: useComponentBlockStore()
  }),
  getters: {},
  actions: {
    /**
     *  window 窗口调整
     */
    setAction(action: Action) {
      this.action = action
    },
    /**
     *  基于当前的action，重置变量
     */
    generateVars() {
      const vars: VarMeta[] = []
      const parseInst = (inst?: ComponentInstance) => {
        if (!inst) {
          return
        }
        // 当前当前层级
        const componentMeta = this.componentBlockStore.getComponentMeta(inst.componentName)
        // componentMeta.blockVarNameProps?.forEach((propName: string) => {
        //   vars.push({
        //     varName: inst.props[propName]
        //   })
        // })
        componentMeta.properties?.forEach((propertyMeta: IPropertySetterMeta) => {
          // 变量属性，且变量名不为空
          // @ts-ignore
          if (propertyMeta.isBlockVarProp && inst.props[propertyMeta.name]) {
            vars.push({
              // @ts-ignore
              name: inst.props[propertyMeta.name],
              // 标题
              label: `${componentMeta.title}-${propertyMeta.title}`,
              // @ts-ignore 优先取元数据中的定义，再取当前动作block组件实例中的description或remark字段
              remark:
                propertyMeta.description ||
                propertyMeta.placeholder ||
                inst.props.description ||
                inst.props.remark
            })
          }
        })

        // 处理子组
        inst.children?.forEach((subInst: ComponentInstance) => {
          parseInst(subInst)
        })
      }

      parseInst(this.action.__commandBlock)
      this.vars.length = 0
      this.vars.push(...vars)
    }
  }
})
