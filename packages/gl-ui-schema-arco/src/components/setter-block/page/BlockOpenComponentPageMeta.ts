export default {
  componentName: 'GlOpenComponentPageBlock',
  displayMode: 'tile',
  iconType: 'gl-file',
  group: 'block_page',
  title: '打开组件页面',
  useBy: ['freePage'],
  blockContent: '打开组件页面，应用Id为：${appId},页面为:${title}',
  properties: [
    {
      name: 'appId',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '应用ID',
      setterComponentName: 'AInput',
      placeholder: '不填写表示当前应用',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'extendId',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '打开页面',
      setterComponentName: 'GlPageSelect',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'mode',
      title: '页面模式',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentName: 'ARadioGroup',
      setterComponentProps: {
        options: [
          {
            label: '抽屉',
            value: 'Drawer',
            __ZJlQQm1EXOC5gVysMI: 'Drawer'
          },
          { label: '弹层', value: 'Modal', __ZJlQQm1EXOC5gVysMI: 'Modal' }
        ]
      },
      displayMode: 'tile',
      setterComponentVModelName: 'modelValue'
    },
    {
      name: 'title',
      setterComponentProps: { value: '默认为1024px' },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '页面标题',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      displayMode: 'tile'
    },
    {
      name: 'width',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '页面宽度',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      displayMode: 'tile'
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
      name: 'pageTemplateName',
      setterComponentProps: {
        options: [
          {
            label: '默认无模板',
            value: ''
          },
          {
            label: '工作流模板',
            value: 'GlPageTemplateFlow'
          }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '页面模板',
      setterComponentName: 'ASelect',
      displayMode: 'tile'
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
      name: 'okText',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '确认按钮文字',
      setterComponentName: 'AInput',
      enableValueExpress: true
    },
    {
      name: 'cancelText',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '取消按钮文字',
      setterComponentName: 'AInput',
      enableValueExpress: true
    },
    {
      name: 'hideCancel',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '隐藏取消按钮',
      setterComponentName: 'ASwitch',
      enableValueExpress: false
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
            label: '点击确认操作时触发，在此可配置表单保存操作等',
            value: 'onBeforeOk'
          },
          {
            label: '页面关闭后触发，在此可配置列表刷新操作等',
            value: 'onClose'
          }
        ],
        multiple: true,
        allowClear: false
      },
      setterComponentVModelName: 'modelValue',
      title: '调用指令',
      setterComponentName: 'ASelect',
      displayMode: 'tile'
    }
  ]
}
