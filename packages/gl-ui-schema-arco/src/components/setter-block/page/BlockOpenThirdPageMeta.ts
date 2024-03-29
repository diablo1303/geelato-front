export default {
  componentName: 'GlOpenThirdPageBlock',
  displayMode: 'tile',
  iconType: 'gl-file',
  group: 'block_page',
  title: '打开外部页面',
  useBy: ['freePage'],
  blockContent: '打开外部页面，地址为：${url}',
  properties: [
    {
      name: 'url',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '地址',
      setterComponentName: 'AInput'
    },
    {
      name: 'params',
      setterComponentProps: {},
      setterComponentVModelName: '',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '参数',
      _showSub: true,
      properties: [
        {
          name: 'name',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '参数名',
          setterComponentName: 'AInput'
        },
        {
          name: 'valueExpression',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          setterComponentProps: { showInput: true },
          setterComponentVModelName: 'modelValue',
          title: '参数值',
          setterComponentName: 'GlExpressionSetter'
        }
      ],
      setterComponentName: 'GlObjectArraySetter',
      titleField: 'name'
    }
  ],
  actions: []
}