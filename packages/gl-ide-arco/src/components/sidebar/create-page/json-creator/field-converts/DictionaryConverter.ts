// 字段元数据示例
// {
//   charMaxLength: '1',
//   comment: '流程审批状态',
//   defaultValue: '0',
//   name: 'wfApprovalStatus',
//   nullable: true,
//   precision: 0,
//   scale: 0,
//   selectType: 'DICTIONARY',
//   title: '流程审批状态',
//   type: 'String',
//   typeExtra: 'approvalStatus'
// }
import { entityApi, FieldMeta, utils } from '@geelato/gl-ui'
import type { ComponentInstance } from '@geelato/gl-ui-schema'

const useDictionaryConvert = async (meta: FieldMeta, inst: ComponentInstance) => {
  if (meta.selectType !== 'DICTIONARY') return false

  let dictId = ''

  // 获取引用的实体信息
  if (meta.typeExtra) {
    const res = await entityApi.query('platform_dict', 'id', {
      dictCode: meta.typeExtra
    })
    dictId = res.data?.length > 0 ? res.data[0]?.id : ''
  }

  // 各字段通用的属性不在这里设置，由外层统一设置，如：label、bindField、rules
  inst.id = utils.gid('dict')
  inst.componentName = 'GlDict'
  inst.props.dictId = dictId
  inst.props.displayType = 'select'
  return true
}

export default useDictionaryConvert
