export default {
  componentName: 'GlTinymce',
  displayMode: 'tile',
  iconType: 'gl-richtext',
  group: 'dataEntry',
  title: '富文本',
  alias: 'tinymce',
  useBy: ['freePage'],
  properties: [
    {
      name: 'label',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '标题',
      setterComponentName: 'AInput',
      enableValueExpress: true
    },
    {
      name: 'hideLabel',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '隐藏标题',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'bindField',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '绑定字段',
      setterComponentName: 'GlEntityFieldSelect',
      enableValueExpress: false
    },
    {
      name: 'height',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '高度',
      setterComponentName: 'AInput',
      setterDefaultValue: '320px'
    },
    {
      name: 'autoUpload',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        uncheckedText: 'Base64',
        checkedText: 'Attachment'
      },
      setterComponentVModelName: 'modelValue',
      title: '图片上传',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'menubar',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        uncheckedText: '禁用',
        checkedText: '启用'
      },
      setterComponentVModelName: 'modelValue',
      title: '菜单栏',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'resize',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        checkedText: '启用',
        uncheckedText: '禁用'
      },
      setterComponentVModelName: 'modelValue',
      title: '调整大小',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'readonly',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '只读',
      setterComponentName: 'ASwitch',
      enableValueExpress: true,
      displayMode: 'tile'
    },
    {
      name: 'disabled',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      description: '是否禁用状态，默认为 false',
      title: '禁用',
      setterComponentName: 'ASwitch',
      show: true,
      expanded: true,
      enableValueExpress: false,
      displayMode: 'tile',
      _showSub: false
    },
    {
      name: '_hidden',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '隐藏',
      description: '页面中存在该组件，只是不可见',
      setterComponentName: 'ASwitch',
      enableValueExpress: true
    },
    {
      name: 'unRender',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '不渲染',
      description: '页面中不存在该组件，不渲染，不可见，一般是为了提高性能在一些场景下不渲染。',
      setterComponentName: 'ASwitch',
      enableValueExpress: true
    },
    {
      name: '_valueExpression',
      setterComponentProps: { showInput: true },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '默认值',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      description: '基于表达式计算默认值'
    },
    {
      name: '_labelColFlex',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '标题宽度',
      setterComponentName: 'AInput',
      description: '标题的宽度，默认的标题占比20%（精确值应为20.83%，这里需填整数去掉.83）',
      placeholder: '如：6% 或 100px'
    },
    {
      name: 'placeholder',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '占位提示',
      setterComponentName: 'AInput',
      enableValueExpress: true
    },
    {
      name: 'description',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '描述',
      setterComponentName: 'AInput',
      enableValueExpress: true
    },
    {
      name: 'rules',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '验证规则',
      setterComponentName: 'GlValidateRulesSetter'
    }
  ],
  actions: [
    { name: 'click', title: '点击' },
    {
      eventName: 'mounted',
      name: 'mounted',
      description: '组件加载完时触发，和Vue的onMounted一致',
      title: '加载完'
    },
    {
      eventName: 'updated',
      name: 'updated',
      description: '组件更新时触发，和Vue的onUpdated一致',
      title: '更新完'
    }
  ]
}
