export default {
  componentName: 'GlRefPage',
  displayMode: 'tile',
  iconType: 'gl-file',
  group: 'layout',
  title: '嵌入引用页面',
  alias: 'refPage',
  useBy: ['freePage'],
  properties: [
    {
      name: 'label',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '标题',
      setterComponentName: 'AInput',
      enableValueExpress: false
    },
    {
      name: 'pageType',
      setterComponentProps: {
        options: [
          {
            label: '平台低代码配置页面',
            value: 'lowcode'
          },
          { label: '平台轻应用编码页面', value: 'code' },
          { label: '第三方页面', value: 'third' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '页面类型',
      description: '',
      setterComponentName: 'ARadioGroup',
      setterDefaultValue: 'lowcode'
    },
    {
      name: 'pageSrc',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '页面地址',
      description: '',
      setterComponentName: 'AInput',
      placeholder: 'https://www.xxx.com/xxx/xxx'
    },
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
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'GlPageSelect',
      title: '配置页面'
    },
    {
      name: 'pageStatus',
      setterComponentProps: {
        options: [
          {
            label: '新增',
            value: 'create'
          },
          {
            label: '复制新增',
            value: 'copyCreate'
          },
          { label: '只读', value: 'read' },
          {
            label: '修改',
            value: 'update'
          }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '页面状态',
      setterComponentName: 'ASelect',
      displayMode: 'tile'
    },
    {
      name: 'params',
      setterComponentProps: {},
      setterComponentVModelName: '',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '页面参数',
      setterComponentName: 'GlObjectArraySetter',
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
          setterComponentName: 'AInput',
          title: '参数名'
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
      titleField: 'name'
    }
  ],
  methods: [
    { name: 'refresh', title: '刷新', description: '以当前一样的参数重新加载页面', params: [] }
  ]
}