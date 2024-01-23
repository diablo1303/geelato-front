export default {
  componentName: 'GlPage',
  displayMode: 'tile',
  iconType: 'gl-file',
  group: 'other',
  title: '页面',
  alias: 'page',
  useBy: ['freePage'],
  properties: [
    {
      name: 'pageTitle',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '标题',
      setterComponentName: 'AInput'
    },
    {
      name: 'pageType',
      setterComponentProps: { readonly: false },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '页面类型',
      description: '只读属性',
      setterComponentName: 'AInput'
    },
    {
      name: 'pageMargin',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '外边距',
      setterComponentName: 'AInput',
      placeholder: '如16px'
    },
    {
      name: 'pagePadding',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '内边距',
      placeholder: '如：14px',
      setterComponentName: 'AInput'
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
    },
    {
      name: 'pageHelp',
      setterComponentProps: {
        entityName: 'platform_app_page_help',
        labelFieldNames: ['title'],
        valueFieldName: 'id',
        allowClear: true,
        allowSearch: true
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      title: '帮助文章',
      placeholder: '',
      description: '该页面相关的帮助文章',
      setterComponentName: 'GlDynamicSelect'
    }
  ],
  actions: [
    {
      name: 'common',
      title: '页面公共动作',
      description: '页面公共动作，不会自动触发（即不受组件自身的事件影响），可由其它动作引用触发。'
    }
  ],
  methods: [
    { name: 'refresh', title: '刷新', description: '以当前一样的参数重新加载页面', params: [] }
  ]
}
