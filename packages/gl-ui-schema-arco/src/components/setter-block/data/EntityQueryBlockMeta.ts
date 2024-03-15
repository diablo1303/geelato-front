export default {
  componentName: 'GlEntityQueryBlock',
  displayMode: 'tile',
  iconType: 'gl-entity-query',
  group: 'block_data',
  title: '实体查询',
  useBy: ['freePage'],
  blockContent: '基于元数据的实体查询对象（EntityReader）进行查询，并返回结果到变量：${dataVarName}。',
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
      enableValueExpress: false,
      displayMode: 'tile',
      _showSub: false
    },
    {
      name: 'dataVarName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      isBlockVarProp:true,
      title: 'data变量',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      displayMode: 'tile',
      description: '实体查询的数据data[]。'
    },
    {
      name: 'respVarName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      isBlockVarProp:true,
      title: 'resp变量',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      displayMode: 'tile',
      description: '实体查询的结果ApiResult:{code:string,message:string,data:[]}'
    }
  ]
}
