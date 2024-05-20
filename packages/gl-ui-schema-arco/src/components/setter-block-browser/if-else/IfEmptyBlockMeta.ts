export default {
  componentName: 'GlIfEmptyBlock',
  displayMode: 'tile',
  iconType: 'gl-if',
  group: 'block_condition',
  title: 'IF 为空',
  useBy: ['freePage'],
  blockContent: "如果目标对象${target}是空，即为null、undefined、''、[]、{}时。",
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
      name: 'target',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '对象',
      setterComponentName: 'AInput'
    }
  ],
  actions: []
}
