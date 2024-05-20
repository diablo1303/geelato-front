export default {
  componentName: 'GlSetValueBlock',
  displayMode: 'tile',
  iconType: 'gl-value-mapper',
  group: 'block_page',
  title: '设置组件值',
  useBy: ['freePage'],
  blockContent: '设置组件${componentId}的值为${value}',
  properties: [
    {
      name: 'appId',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '应用',
      setterComponentName: 'GlAppSelect',
      placeholder: ''
    },
    {
      name: 'extendId',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '页面',
      setterComponentName: 'GlPageSelect',
      enableValueExpress: false
    },
    {
      name: 'componentId',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '设置的组件',
      setterComponentName: 'GlPageComponentSelect',
      enableValueExpress: false
    },
    {
      name: 'value',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '设置组件值',
      setterComponentProps: { showInput: true },
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'GlExpressionSetter'
    }
  ],
  actions: []
}