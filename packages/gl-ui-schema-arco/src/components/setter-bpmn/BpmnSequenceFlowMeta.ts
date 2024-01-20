export default {
  componentName: 'GlBpmnSequenceFlow',
  displayMode: 'tile',
  iconType: 'gl-edge1',
  group: 'bpmn',
  title: '连线',
  alias: 'bpmn_s_f',
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
