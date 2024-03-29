export default {
  componentName: 'GlSetVisibleBlock',
  displayMode: 'tile',
  iconType: 'gl-hide',
  group: 'block_page',
  title: '设置组件隐藏',
  useBy: ['freePage'],
  blockContent: '设置组件:${componentId}，是否隐藏（不可见）:${_hidden}',
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
      title: '调用的组件',
      setterComponentName: 'GlPageComponentSelect',
      enableValueExpress: false
    },
    {
      name: '_hidden',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '是否隐藏',
      setterComponentName: 'ASwitch',
      enableValueExpress: false,
      placeholder: '这里的隐藏即不渲染',
      setterDefaultValue: false
    }
  ],
  actions: []
}