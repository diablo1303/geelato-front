import { utils } from '@geelato/gl-ui'
import { ComponentInstance } from '@geelato/gl-ui-schema'
import { PageCreator, PageCreatorOptions } from './PageCreator'
import { useComponentStore } from '@geelato/gl-ide'
import { useFieldMetaToComponentInst } from './useFieldMetaToComponentInst'

export const useCardConfig = (options: PageCreatorOptions): ComponentInstance => {
  const inst = new ComponentInstance()
  inst.id = utils.gid('card')
  inst.componentName = 'GlCard'
  inst.props = { label: `${options.entityMeta.entityTitle}卡片`, bordered: false, showLabel: false }
  return inst
}

export const useEntityFormConfig = (options: PageCreatorOptions): ComponentInstance => {
  const inst = new ComponentInstance()
  inst.id = utils.gid('form')
  inst.componentName = 'GlEntityForm'
  inst.props = {
    label: `${options.entityMeta.entityTitle || '实体'}表单`,
    bindEntity: { appCode: '', entityName: options.entityMeta.entityName },
    layout: 'horizontal',
    autoLabelWidth: true
  }
  inst.children = []
  return inst
}

export const useVirtualConfig = (label?: string) => {
  const inst = new ComponentInstance()
  inst.id = utils.gid('virtual')
  inst.componentName = 'GlVirtual'
  inst.props.label = label || '项'
  return inst
}

export const useRowColLayoutConfig = (row: LayoutRow, label?: string) => {
  const inst = new ComponentInstance()
  inst.id = utils.gid('rclayout')
  inst.componentName = 'GlRowColLayout'
  inst.props = {
    label: label || '栅格布局',
    spans: row.spans
  }

  row.fields.forEach((field: ComponentInstance) => {
    const virtual = useVirtualConfig()
    virtual.children.push(field)
    inst.children.push(virtual)
  })

  return inst
}

export class LayoutRow {
  spans: number[] = [8, 8, 8]
  fields: ComponentInstance[] = []
}

export class FormPageCreator extends PageCreator {
  componentStore = useComponentStore()

  async buildChildren(page: ComponentInstance, options: PageCreatorOptions): Promise<ComponentInstance> {
    const card = useCardConfig(options)

    const insts = await useFieldMetaToComponentInst(
        options.entityMeta.entityName,
        options.entityMeta.fieldMetas
    )

    // 占用一行的组件
    const oneRowComponentNames = ['ATextarea']
    const oneRowInsts: ComponentInstance[] = []
    const notOneRowInsts = insts.filter((inst) => {
      const isOneRowInst = oneRowComponentNames.includes(inst.componentName)
      if (isOneRowInst) {
        oneRowInsts.push(inst)
        return false
      } else {
        return true
      }
    })
    // TODO 对不是独占一行的字段进行排序
    // 最后一个字相同的放在一起
    // 人员组件放在一起
    // 组织组件放在一起
    // 字段有数字的放在一起
    // 时间先后，如开始XX在结束XX之前，生效XX在失效XX之前

    const rows = this.groupByRow(notOneRowInsts, options.colSpan)
    rows.forEach((row: LayoutRow) => {
      const rcl = useRowColLayoutConfig(row)
      card.children.push(rcl)
    })
    // 将独占一行的组件放到最后，如备注
    oneRowInsts.forEach((inst) => {
      const row: LayoutRow = new LayoutRow()
      row.spans = [24]
      row.fields.push(inst)
      const rcl = useRowColLayoutConfig(row)
      card.children.push(rcl)
    })

    const formConfig = useEntityFormConfig(options)
    formConfig.children.push(card)
    page.children.push(formConfig)
    return page
  }

  /**
   * 将字段组件按行分组
   * @param insts
   * @param colSpan
   */
  groupByRow(insts: ComponentInstance[], colSpan: number) {
    const result: LayoutRow[] = []
    for (let i = 0; i < insts.length; i += colSpan) {
      const colInsts = insts.slice(i, i + colSpan)
      const row: LayoutRow = new LayoutRow()
      row.fields = insts.slice(i, i + colSpan)
      row.spans = this.getSpans(colSpan)
      result.push(row)
    }
    return result
  }

  orderInsts(insts: ComponentInstance[]) {
    // 找出remark放到最后
    insts.filter(() => {})
    return insts
  }

  getSpans(colSpan: number) {
    switch (colSpan) {
      case 1:
        return [24]
      case 2:
        return [12, 12]
      case 3:
        return [8, 8, 8]
      case 4:
        return [6, 6, 6, 6]
      default:
        return [8, 8, 8]
    }
  }
}
