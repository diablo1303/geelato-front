export default {
  componentName: 'GlGetArgBlock',
  displayMode: 'tile',
  iconType: 'gl-parameter',
  group: 'block_var',
  title: '获取动作参数',
  useBy: ['freePage'],
  blockContent: '获取动作参数${paramName}，保存到变量${varName}。',
  properties: [
    {
      name: 'paramName',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '选择参数',
      placeholder: '请选择参数',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'GlActionArgumentSetter'
    },
    {
      name: 'varName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      isBlockVarProp: true,
      title: '结果存为变量',
      setterComponentName: 'AInput',
      description: '变量名称，如：var1、var2，不需在带上前缀“$gl.vars.”，如果录入“$gl.vars.”，会被自动清空。在JS代码块中编写引用该变量时，需要带上,如：$gl.vars.var1',
      placeholder: '如：var1，不要写：$gl.vars.var1'
    },
    {
      name: 'remark',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '描述',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'AInput',
      placeholder: ''
    }
  ]
}
