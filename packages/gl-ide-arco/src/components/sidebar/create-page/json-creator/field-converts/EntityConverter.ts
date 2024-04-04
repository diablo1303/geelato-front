// 字段元数据示例
import {entityApi, FieldMeta, utils} from '@geelato/gl-ui'
import type { ComponentInstance } from '@geelato/gl-ui-schema'

const useEntityConvert = async (meta: FieldMeta, inst: ComponentInstance) => {
  if (meta.selectType !== 'ENTITY') return false

  let entityName = ''
  let entityMeta = { entityName: '' }

  // 获取引用的实体信息
  if (meta.typeExtra) {
    const res = await entityApi.query('platform_dev_table', 'entityName', {
      id: meta.typeExtra
    })
    entityMeta = res.data?.length > 0 ? res.data[0] : { entityName: '' }
  }

  // 各字段通用的属性不在这里设置，由外层统一设置，如：label、bindField、rules
  inst.id = utils.gid('select')
  inst.componentName = 'GlDynamicSelect'
  inst.props.entityName = entityMeta.entityName
  // TODO 这里的name后续需依据模型的定义获取标题字段
  inst.props.labelFieldNames = ['name']
  inst.props.valueFiledName = 'id'
  inst.props.valueFilter = []
  inst.props.extraFieldAndBindIds = []
  return true
}

export default useEntityConvert
