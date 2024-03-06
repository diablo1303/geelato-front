export default {
  componentName: 'GlSetVarBlock',
  displayMode: 'tile',
  iconType: 'gl-var',
  group: 'block_var',
  title: '设置变量、变量赋值',
  useBy: ['freePage'],
  blockContent: '设置变量：${varName} 值为：${varValue}。',
  properties: [
    {
      name: 'varName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      isBlockVarProp: true,
      title: '变量名称',
      setterComponentName: 'AInput'
    },
    {
      name: 'varValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '变量值',
      placeholder: '变量值表达式',
      setterComponentProps: { showInput: true },
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'GlExpressionSetter'
    },
    {
      name: 'remark',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '变量描述',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'AInput',
      placeholder: '可选填，如中文名'
    }
  ]
}
