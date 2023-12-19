import { ComponentInstance } from '@geelato/gl-ui-schema'
import type { FieldMeta } from '@geelato/gl-ui'
import { utils } from '@geelato/gl-ui'
import { useComponentStore } from '@geelato/gl-ide'

export const useFieldMetaToComponentInst = (entityName: string, fieldMetas: FieldMeta[]) => {
  const componentStore = useComponentStore()

  /**
   * 基于模型字段元数据，转成单个组件实例
   * @param entityName
   * @param fieldMeta
   */
  function convertOne(entityName: string, fieldMeta: FieldMeta) {
    console.log('convertOne', entityName, fieldMeta)
    const inst = new ComponentInstance()
    inst.group = 'dataEntry'
    inst.props = {
      label: fieldMeta.title,
      rules: [],
      bindField: {
        appCode: '',
        fieldName: fieldMeta.name,
        entityName: entityName
      }
    }
    inst.slots = {}
    inst.children = []

    // 规则配置
    if (fieldMeta.nullable === false) {
      // @ts-ignore
      inst.props.rules.push({
        required: true,
        message: '必填',
        ruleName: 'required',
        type: 'boolean'
      })
    }

    switch (fieldMeta.type) {
      case 'String':
        // TODO 可按醋类型细化，发编码组件、颜色组件、字典组件...
        if (parseInt(fieldMeta.charMaxLength) > 200) {
          inst.componentName = 'ATextarea'
        } else {
          inst.componentName = 'AInput'
        }
        break
      case 'Date':
        // TODO 可按模型类型细化
        inst.componentName = 'ADatePicker'
        inst.props.format = 'YYYY-MM-DD HH:mm'
        break
      case 'Double':
        inst.componentName = 'AInputNumber'
        inst.props.max = 10 ** fieldMeta.precision - 1
        inst.props.precision = fieldMeta.scale
        break
      case 'Integer':
      case 'Long':
        inst.componentName = 'AInputNumber'
        inst.props.max = 10 ** fieldMeta.precision - 1
        break
      case 'Boolean':
        inst.componentName = 'ASwitch'
        break
      default:
        inst.componentName = 'AInput'
        break
    }

    inst.id = utils.gid(componentStore.getAlias(inst.componentName))
    return inst
  }

  /**
   * 基于模型字段元数据，转成所有组件实例
   * @param entityName
   * @param fieldMetas
   */
  function convertAll(entityName: string, fieldMetas: FieldMeta[]) {
    const result: ComponentInstance[] = []
    fieldMetas?.forEach((fieldMeta: FieldMeta) => {
      const inst: ComponentInstance = convertOne(entityName, fieldMeta)
      result.push(inst)
    })
    return result
  }

  return convertAll(entityName, fieldMetas)
}
