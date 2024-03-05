import type { ComponentInstance, InnerComponentPosition } from '@geelato/gl-ui-schema'
import { utils } from '@geelato/gl-ui'
import { useComponentStore } from '@geelato/gl-ide'

/**
 * 解析组件的内置组件，并添加到组件树中
 * 以便于在做组件的脚本编排时，可以方便选择到内置组件
 * @param pageInst
 */
export const useParseInnerComponent = (pageInst: ComponentInstance) => {
  const componentStore = useComponentStore()

  const parseInst = (inst: ComponentInstance) => {
    // console.log('parseInst', inst.componentName, pageInst)
    // 处理子级
    if (inst.children?.length > 0) {
      inst.children.forEach((subInst: ComponentInstance) => {
        parseInst(subInst)
      })
    }

    // 处理当前级
    const componentMeta = componentStore.getComponentMeta(inst.componentName)
    // 基于元数据定义，将组件的内置组件解析出来放置到组件的树中
    componentMeta.innerComponents?.forEach((innerComponentPosition: InnerComponentPosition) => {
      if (innerComponentPosition.propPath) {
        let getSubInsts = utils.getProperty(inst, innerComponentPosition.propPath)
        console.log('getSubInsts', getSubInsts, innerComponentPosition.propPath)
        let subComponents: ComponentInstance[] = []
        if (getSubInsts) {
          const subInsts = utils.isArray(getSubInsts) ? getSubInsts : [getSubInsts]
          subInsts.forEach((subInst: any) => {
            if (subInst.componentName) {
              subComponents.push(subInst)
            } else {
              // 没有组件名，但是有组件的，表示下一级为组件，需要解析一层
              if (subInst.component || subInst._component) {
                subComponents.push(subInst.component || subInst._component)
              } else {
                // 其它未知的格式
                console.error('解析不成功，未加入组件树中，未知的组件格式，subInst：', subInst)
              }
            }
          })
          //
          inst.children.push({
            id: utils.gid('virtual'),
            // @ts-ignore 用于树组件，标识不可选择
            selectable: false,
            title: `${innerComponentPosition.title}（组）`,
            componentName: 'GlVirtual',
            props: { title: innerComponentPosition.title },
            slots: {},
            // @ts-ignore
            children: subComponents,
            actions: []
          })
        }
      }
    })
  }
  parseInst(pageInst)
}
