export default {
  componentName: 'GlElseBlock',
  displayMode: 'tile',
  iconType: 'gl-if',
  group: 'block_condition',
  title: 'Else 其它',
  useBy: ['freePage'],
  blockContent: '${description}',
  properties: [
    {
      name: 'description',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '描述',
      setterComponentName: 'ATextarea'
    }
  ],
  actions: []
}