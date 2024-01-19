export default {
  componentName: 'GlBpmnParallelGateway',
  displayMode: 'tile',
  iconType: 'gl-gateway-parallel',
  group: 'bpmn',
  title: '并行网关',
  alias: 'bpmn_p_g',
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