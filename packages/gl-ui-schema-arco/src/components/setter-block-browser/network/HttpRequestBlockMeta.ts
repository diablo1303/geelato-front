export default {
  componentName: 'GlHttpRequestBlock',
  displayMode: 'tile',
  iconType: 'gl-file',
  group: 'block_network',
  title: 'Http请求',
  useBy: ['freePage'],
  blockContent: '发起http请求${title}',
  properties: [
    {
      name: 'title',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '标题',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'url',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '请求地址',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      displayMode: 'tile'
    },
    {
      name: 'method',
      title: '请求方法',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentName: 'ASelect',
      setterComponentProps: {
        options: [
          { label: 'Get', value: 'get' },
          { label: 'Post', value: 'post' }
        ]
      },
      displayMode: 'tile',
      setterComponentVModelName: 'modelValue'
    },
    {
      name: 'params',
      setterComponentProps: {},
      setterComponentVModelName: '',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '页面参数',
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
          title: '参数名',
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
          title: '参数值'
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
      name: 'data',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '请求body',
      setterComponentName: 'AInput',
      enableValueExpress: true
    },
    {
      name: 'header',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '请求header',
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
          title: '参数名',
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
          title: '参数值'
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
      name: 'widthDefaultHeader',
      setterComponentProps: {
        uncheckedText: '请求第三方，不带上平台默认header',
        checkedText: '请求本平台，带上平台默认header'
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      title: '默认header',
      description:
        '请求时是否携带平台默认的header（内有登录的token），请如请求平台的自有的应用时需要带上，请求第三方应用不需带上。',
      setterComponentName: 'ASwitch'
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
      description:
        'axios请求返回结果{config:object,data:object,header:object,request:XMLHttpRequest,status:number,statusText:string}'
    },
    {
      name: 'enableAwait',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '同步调用',
      setterComponentName: 'ASwitch',
      enableValueExpress: false,
      description:
        '是否同步调用该方法，对于自身为异步的方法有效，如服务端请求，启用则在方法调用前加await'
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
      description:
        '返回该方法的调用执行结果，如果是同步调用，则返回结果数据，若为异常调用，则返回promise对象。'
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
    }, {
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
      description: '请求成功时回调方法内，默认创建$gl.vars.res_xxx,可以改成其它名称，这里不需编写$gl.vars部分，只需写变量名即可，如res。'
    },{
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
      description: '请求失败时回调方法内，默认创建$gl.vars.e_xxx,可以改成其它名称，这里不需编写$gl.vars部分，只需写变量名即可，如e。'
    },
  ]
}
