export default {
  componentName: 'GlBpmnExclusiveGateway',
  displayMode: 'tile',
  iconType: 'gl-gateway-xor',
  group: 'bpmn',
  title: '排他网关',
  alias: 'bpmn_e_g',
  useBy: ['bpmnPage'],
  properties: [
    {
      name: 'id',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {readonly: true},
      setterComponentVModelName: 'modelValue',
      title: 'ID',
      setterComponentName: 'AInput',
      enableValueExpress: false
    },
    {
      name: 'text',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '名称',
      setterComponentName: 'AInput',
      enableValueExpress: false
    }
  ]
}