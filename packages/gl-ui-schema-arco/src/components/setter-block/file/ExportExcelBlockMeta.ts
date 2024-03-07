export default {
  componentName: 'GlExportExcelBlock',
  displayMode: 'tile',
  iconType: 'gl-file-excel',
  group: 'block_file',
  title: '导出Excel',
  useBy: ['freePage'],
  blockContent: `将数据$\{varName}导出到Excel（$\{fileName}）。`,
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
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: 'Excel模板',
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
            value: 'data',
            __MSKzjrlvedxBnMhBMm: 'data'
          },
          { label: 'mql数据查询对象', value: 'mql', __MSKzjrlvedxBnMhBMm: 'mql' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      title: '数据类型',
      description: '传到服务端的数据类型',
      setterComponentName: 'ASelect',
      setterDefaultValue: 'mql'
    },
    {
      name: 'varName',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      placeholder: '如：$gl.vars.xxx',
      description: '上下文中可获取的最终数据对象或GQL查询数据对象的变量名',
      title: '数据源变量名',
      setterComponentName: 'AInput',
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
      isBlockVarProp:true,
      title: '回调成功参数名',
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