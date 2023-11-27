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
        uncheckedText: '不带上平台默认header',
        checkedText: '带上平台默认header'
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
        '请求时是否携带平台默认的header，请如请求平台的自有的应用时需要带上，请求第三方应用不需带上。',
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
      title: 'resp变量',
      setterComponentName: 'AInput',
      enableValueExpress: false,
      displayMode: 'tile',
      description:
        'axios请求返回结果{config:object,data:object,header:object,request:XMLHttpRequest,status:number,statusText:string}'
    }
  ]
}
