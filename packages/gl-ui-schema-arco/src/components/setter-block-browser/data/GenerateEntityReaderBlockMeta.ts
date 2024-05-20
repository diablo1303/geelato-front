export default {
  componentName: 'GlGenerateEntityReaderBlock',
  displayMode: 'tile',
  iconType: 'gl-file-json',
  group: 'block_data',
  title: '构建查询',
  useBy: ['freePage'],
  blockContent: '构建基于元数据的实体查询对象（EntityReader），并存到变量：${varName}。',
  properties: [
    {
      name: 'entityReader',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: { options: [] },
      setterComponentVModelName: 'modelValue',
      title: '实体查询',
      setterComponentName: 'GlEntityReaderSetter',
      enableValueExpress: true,
      displayMode: 'tile',
      _showSub: false
    },
    {
      name: 'varName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      isBlockVarProp:true,
      title: '实体查询对象变量',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      displayMode: 'tile',
      description: '实体查询的结果ApiResult或EntityReader，依据“是否执行查询”的配置返回不同的值。'
    }
  ]
}
