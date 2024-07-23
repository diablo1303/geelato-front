export default {
  componentName: 'GlLogBlock',
  displayMode: 'tile',
  iconType: 'gl-log',
  group: 'block_other',
  title: '输出日志',
  useBy: ['freePage'],
  blockContent: '控制台输出日志内容${content}',
  properties: [
    {
      name: 'method',
      setterComponentProps: {
        options: [
          {
            label: '信息',
            value: 'log'
          },
          {
            label: '错误',
            value: 'error'
          }
        ],
        allowClear: false
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '日志方法',
      setterComponentName: 'ASelect',
      enableValueExpress: false,
      placeholder: ''
    },
    {
      name: 'message',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '基本信息',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      placeholder: '基本信息'
    },
    {
      name: 'content',
      setterComponentProps: {showInput: true},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '更多内容',
      setterComponentName: 'GlExpressionSetter',
      enableValueExpress: false,
      placeholder: ''
    }
  ],
  actions: []
}