export default {
  componentName: 'GlBlocks',
  displayMode: 'tile',
  iconType: 'gl-border',
  group: 'dataDisplay',
  title: '块',
  alias: 'blocks',
  useBy: ['freePage'],
  properties: [
    {
      name: 'entityReader',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          {
            label: '标题',
            value: 'name'
          },
          { label: '图标', value: 'icon' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '数据实体',
      setterComponentName: 'GlEntityReaderSetter',
      description: '树数据实体',
      displayMode: 'tile'
    },
    {
      name: 'disabled',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      description: '是否禁用状态，默认为 false',
      title: '禁用',
      setterComponentName: 'ASwitch',
      show: true,
      expanded: true
    },
    {
      name: '_hidden',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '隐藏',
      description: '页面中存在该组件，只是不可见',
      setterComponentName: 'ASwitch',
      enableValueExpress: true
    },
    {
      name: 'unRender',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '不渲染',
      description: '页面中不存在该组件，不渲染，不可见，一般是为了提高性能在一些场景下不渲染。',
      setterComponentName: 'ASwitch',
      enableValueExpress: true
    }
  ],
  actions: [
    { name: 'click', title: '点击' }
  ]
}
