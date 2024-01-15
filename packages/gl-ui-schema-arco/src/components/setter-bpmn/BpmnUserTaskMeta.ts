export default {
  componentName: 'GlBpmnUserTask',
  displayMode: 'tile',
  iconType: 'gl-user-task',
  group: 'bpmn',
  title: '用户任务',
  alias: 'bpmn_u_t',
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
    },
    {
      name: 'multiInstanceType',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          { label: 'none', __Gf4RZdpu3LuS6LiNCv: 'none', value: 'none' },
          { label: 'parallel', __Gf4RZdpu3LuS6LiNCv: 'parallel', value: 'parallel' },
          { label: 'sequential', __Gf4RZdpu3LuS6LiNCv: 'sequential', value: 'sequential' }
        ],
        multiple: false
      },
      setterComponentVModelName: 'modelValue',
      title: 'Multi-instance Type',
      setterComponentName: 'ASelect',
      enableValueExpress: false,
      displayMode: 'tile',
      setterDefaultValue: 'none'
    }
  ]
}
