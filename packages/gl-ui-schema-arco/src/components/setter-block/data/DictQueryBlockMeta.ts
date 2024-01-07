export default {
  componentName: 'GlDictQueryBlock',
  displayMode: 'tile',
  iconType: 'gl-dict',
  group: 'block_data',
  title: '字典项查询',
  useBy: ['freePage'],
  blockContent: '依据字典ID和字典项值${dictItemCode}获取字典项，并存到变量：${dataVarName}。',
  properties: [
    {
      name: 'dictId',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '查询的字典',
      setterComponentName: 'GlDictSetter',
      enableValueExpress: false,
      displayMode: 'tile',
    }, {
      name: 'dictItemValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '查询字典项值',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      displayMode: 'tile',
    },
    {
      name: 'dataVarName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '结果data变量',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      displayMode: 'tile',
      description: '查询的数据data[]。'
    },
    {
      name: 'respVarName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '结果resp变量',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      displayMode: 'tile',
      description: '查询的结果ApiResult:{code:string,message:string,data:[]}'
    }
  ]
}
