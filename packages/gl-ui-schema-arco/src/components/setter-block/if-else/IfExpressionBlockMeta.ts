export default {
  componentName: 'GlIfExpressionBlock',
  displayMode: 'tile',
  iconType: 'gl-if',
  group: 'block_condition',
  title: 'IF 表达式',
  useBy: ['freePage'],
  blockContent: '如果满足条件：${expression}',
  properties: [
    {
      name: 'mode',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {
        type: 'button',
        options: [
          { label: '如果IF', value: 'if' },
          {
            label: '否则如果ELES IF',
            value: 'else if'
          }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '模式',
      setterComponentName: 'ARadioGroup',
      setterDefaultValue: 'if'
    },
    {
      name: 'expression',
      setterComponentProps: { showInput: true },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '表达式',
      setterComponentName: 'GlExpressionSetter'
    }
  ],
  actions: []
}
