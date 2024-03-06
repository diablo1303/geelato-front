export default {
  componentName: 'GlComponentInvokeBlock',
  displayMode: 'tile',
  iconType: 'gl-api',
  group: 'block_page',
  title: '调用组件方法',
  useBy: ['freePage'],
  blockContent: '调用组件：${componentId}，方法：${methodName}，结果存到变量:${resultVar}',
  properties: [
    {
      name: 'appId',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '应用',
      setterComponentName: 'GlAppSelect',
      placeholder: ''
    },
    {
      name: 'extendId',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '页面',
      setterComponentName: 'GlPageSelect',
      enableValueExpress: false
    },
    {
      name: 'componentId',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '调用的组件',
      setterComponentName: 'GlPageComponentSelect',
      enableValueExpress: false
    },
    {
      name: 'methodName',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '调用的方法',
      setterComponentName: 'GlComponentMethodSelect',
      enableValueExpress: false
    },
    {
      name: 'params',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '方法参数',
      setterComponentName: 'GlComponentParamSetter',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'returnInfo',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '方法返回说明',
      setterComponentName: 'GlComponentReturnSetter',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'resultVar',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      isBlockVarProp: true,
      title: '结果变量',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      placeholder: '方法调用返回存储的变量'
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
      description: '返回该方法的调用执行结果，启用则在方法调用前添加return'
    }
  ],
  actions: []
}
