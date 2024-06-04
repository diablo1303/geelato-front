export default {
  componentName: 'GlEntitySaverBlock',
  displayMode: 'tile',
  iconType: 'gl-save',
  group: 'block_data',
  title: '已有实体保存',
  useBy: ['freePage'],
  blockContent: '基于已有的元数据的实体保存对象（EntitySaver）进行保存，并返回结果到变量：${resultVar}。',
  properties: [
    {
      name: 'entitySaverVar',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '实体保存对象',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      placeholder: '实体保存对象的变量名entitySaverStr'
    },
    {
      name: 'resultVar',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '结果变量',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      placeholder: '方法调用返回存储的变量',
      isBlockVarProp:true
    },
    {
      name: 'enableReturn',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '返回结果',
      setterComponentName: 'ASwitch',
      enableValueExpress: false,
      description: '返回该方法的调用执行结果，启用则在方法调用前添加return',
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
      setterComponentName: 'AInput',
      enableValueExpress: false,
      isBlockVarProp:true,
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
      title: '回调失败参数名',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      isBlockVarProp:true,
      displayMode: 'tile',
      description:
        '请求失败时回调方法内，默认创建$gl.vars.e_xxx,可以改成其它名称，这里不需编写$gl.vars部分，只需写变量名即可，如e。'
    }
  ]
}
