export default {
  componentName: 'GlReadClipboardTableBlock',
  displayMode: 'tile',
  iconType: 'gl-paste',
  group: 'block_other',
  title: '读剪切板表格',
  useBy: ['freePage'],
  blockContent: '读取剪切板的内容为表格，结果存在变量${varName}',
  properties: [
    {
      name: 'splitChar',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '分隔符',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      placeholder: '分隔符,如：“,”、“\t”，默认不填写使用制表符“\t”',
      description: '分隔符,如：“,”、“\t”，默认不填写使用制表符“\t”，适用于从excel中直接copy表格内容;如果需要从csv的文本中读取表格，请填写半角“,”。'
    },
    {
      name: 'varName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '结果变量名',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      isBlockVarProp: true,
      placeholder: '结果保存到变量'
    },
    {
      name: 'cellMetas',
      setterComponentProps: {},
      setterComponentVModelName: '',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      _showSub: true,
      properties: [
        {
          name: 'name',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '列名称',
          setterComponentName: 'AInput',
          placeholder: ''
        },
        {
          name: 'valueType',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {
            options: [
              { label: '字符串', value: 'STRING' },
              { label: '数值', value: 'NUMBER' },
              { label: '日期', value: 'DATE' },
              { label: '时间', value: 'DATETIME' }
            ]
          },
          setterComponentVModelName: 'modelValue',
          title: '数据类型',
          setterComponentName: 'ASelect'
        }
      ],
      setterComponentName: 'GlObjectArraySetter',
      title: '列数据定义',
      titleField: 'name',
      subTitleField: 'valueType',
      enableValueExpress: false,
      alarmIfNoSubTitle: ''
    },
  ],
  actions: []
}