export default {
  componentName: 'GlExportWordBlock',
  displayMode: 'tile',
  iconType: 'gl-file-word',
  group: 'block_file',
  title: '导出Word',
  useBy: ['freePage'],
  blockContent: `将数据$\{varName}导出到Word（$\{fileName}）。`,
  properties: [
    {
      name: 'fileName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '文件名',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      displayMode: 'tile'
    },
    {
      name: 'fileTemplate',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        useType:'export'
      },
      setterComponentVModelName: 'modelValue',
      title: 'Word模板',
      setterComponentName: 'GlAppFileTemplateSelect',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'dataType',
      setterComponentProps: {
        multiple: false,
        options: [
          {
            label: '最终数据对象',
            value: 'data'
          },
          { label: 'mql数据查询对象', value: 'mql' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: false,
      expanded: true,
      displayMode: 'tile',
      title: '数据源类型',
      description: '传到服务端的数据类型',
      setterComponentName: 'ASelect',
      setterDefaultValue: 'data'
    },
    {
      name: 'mainRecordExp',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: { showInput: true},
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'GlExpressionSetter',
      title: '主表数据源',
      description: '主表数据源，用于生成Word的标题、汇总值等信息，格式为Record<string,any>，如：{name: "张三", age: 18}',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'subRecordsArray',
      setterComponentProps: {},
      setterComponentVModelName: '',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '列表数据源',
      _showSub: false,
      properties: [
        {
          name: 'name',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '列表名称',
          setterComponentName: 'AInput'
        },
        {
          name: 'valueExpression',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          setterComponentProps: { showInput: true },
          setterComponentVModelName: 'modelValue',
          setterComponentName: 'GlExpressionSetter',
          title: '列表值'
        }
      ],
      setterComponentName: 'GlObjectArraySetter',
      titleField: 'name',
      enableValueExpress: false,
      displayMode: 'tile',
      subTitleField: '',
      alarmIfNoSubTitle: ''
    },
    {
      name: 'varName',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {placeholder:'如：$gl.vars.xxx'},
      setterComponentVModelName: 'modelValue',
      placeholder: '如：$gl.vars.xxx',
      description: '上下文中可获取的最终数据对象或GQL查询数据对象的变量名',
      title: '数据源变量名',
      setterComponentName: 'AInput'
    },
    {
      name: 'enableAwait',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      description: '是否同步调用该方法，对于自身为异步的方法有效，如服务端请求',
      title: '同步调用',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'respVarName',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      placeholder: '',
      description: '导出操作执行之后返回结果存储的变量名',
      title: '返回结果变量',
      setterComponentName: 'AInput'
    },
    {
      name: 'invokeBlocks',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          {
            label: '请求成功时回调',
            value: 'fulfilled'
          },
          {
            label: '请求失败时回调',
            value: 'rejected'
          }
        ],
        multiple: true,
        allowClear: false
      },
      setterComponentVModelName: 'modelValue',
      title: '调用指令',
      setterComponentName: 'ASelect',
      displayMode: 'tile',
      description:
        '请求成功时回调方法内，默认创建$gl.vars.res_xxx，存储http请求的返回。请求失败时回调方法内，默认创建$gl.vars.e_xxx，存储请求异常对象Exception。请求成功时回调方法内的返回值，将作为Promise 对象的兑现值。'
    },
    {
      name: 'fulfilledVarName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '回调成功参数名',
      isBlockVarProp:true,
      setterComponentName: 'AInput',
      enableValueExpress: false,
      displayMode: 'tile',
      description:
        '请求成功时回调方法内，默认创建$gl.vars.res_xxx,可以改成其它名称，这里不需编写$gl.vars部分，只需写变量名即可，如res。'
    },
    {
      name: 'rejectedVarName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      isBlockVarProp:true,
      title: '回调失败参数名',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      displayMode: 'tile',
      description:
        '请求失败时回调方法内，默认创建$gl.vars.e_xxx,可以改成其它名称，这里不需编写$gl.vars部分，只需写变量名即可，如e。'
    }
  ]
}
