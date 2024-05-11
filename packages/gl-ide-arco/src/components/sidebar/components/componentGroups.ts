import { ComponentMaterial, ComponentMaterialGroup } from '@geelato/gl-ui-schema'

export default function useComponentGroups(
  allGroups: Array<ComponentMaterialGroup>,
  componentMaterialStore: any
) {
  const componentMaterialGroups = []
  for (let index in allGroups) {
    const componentMaterialItems = componentMaterialStore.componentMaterials.filter(
      (componentMaterial: ComponentMaterial) => {
        return componentMaterial.group === allGroups[index].name
      }
    )
    const componentMaterialGroup = new ComponentMaterialGroup()
    componentMaterialGroup.name = allGroups[index].name
    componentMaterialGroup.text = allGroups[index].text
    componentMaterialGroup.opened = allGroups[index].opened
    componentMaterialGroup.items = componentMaterialItems
    componentMaterialGroups.push(componentMaterialGroup)
  }
  return componentMaterialGroups
}

export  type ComponentSidebarTab ={
  // 内置的TAB key，如“组件”、“模板”、“自定义区块”
  key: string,
  title: string,
  show: boolean,
  tips?: string
}