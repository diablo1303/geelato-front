export default {
  componentName: 'GlJsCodeApiBlock',
  displayMode: 'tile',
  iconType: 'gl-code',
  group: 'block_api_var',
  title: 'JS代码',
  useBy: ['freePage'],
  blockContent: '${code}',
  blockContentLanguage: 'javascript',
  properties: [
    {
      name: 'code',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '代码',
      setterComponentProps: { showInput: true },
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'GlExpressionSetter',
      enableValueExpress: false,
      placeholder: '代码内容'
    },
    {
      name: 'description',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '代码描述',
      setterComponentName: 'ATextarea',
      enableValueExpress: false,
      placeholder: '代码描述'
    }
  ],
  actions: []
}
