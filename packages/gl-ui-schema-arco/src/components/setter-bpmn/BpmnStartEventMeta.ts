export default {
  componentName: 'GlBpmnStartEvent',
  displayMode: 'tile',
  iconType: 'gl-start-event-none',
  group: 'bpmn',
  title: '开始',
  alias: 'bpmn_s_e',
  useBy: ['bpmnPage'],
  properties: [
    {
      name: 'id',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: { readonly: true },
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