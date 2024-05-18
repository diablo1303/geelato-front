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
      setterComponentName: 'AInput',
      description: '变量名称，如：var1、var2，不需在带上前缀“$gl.vars.”，如果录入“$gl.vars.”，会被自动清空。在JS代码块中编写引用该变量时，需要带上,如：$gl.vars.var1',
      placeholder: '如：var1，不要写：$gl.vars.var1'
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
