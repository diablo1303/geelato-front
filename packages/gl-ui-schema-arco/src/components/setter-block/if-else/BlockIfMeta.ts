export default {
  componentName: 'GlIfBlock',
  displayMode: 'tile',
  iconType: 'gl-if',
  group: 'block_condition',
  title: 'IF 条件',
  useBy: ['freePage'],
  blockContent: '如果满足条件：${target1} ${relationship} ${target2}',
  deprecated:true,
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
      name: 'target1',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      title: '对象1',
      setterComponentName: 'AInput'
    },
    {
      name: 'relationship',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          { label: '恒等于', value: '===' },
          { label: '等于', value: '==' },
          {
            label: '不等于',
            value: '!='
          },
          { label: '大于', value: '>' },
          { label: '大于等于', value: '>=' },
          {
            label: '小于',
            value: '<'
          },
          { label: '小于等于', value: '<=' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '关系',
      setterComponentName: 'ASelect'
    },
    {
      name: 'target2',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      enableValueExpress: true,
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '对象2',
      setterComponentName: 'AInput'
    }
  ],
  actions: []
}
