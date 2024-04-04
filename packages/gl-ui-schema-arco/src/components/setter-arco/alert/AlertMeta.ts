export default {
  componentName: 'GlAlert',
  displayMode: 'tile',
  iconType: 'gl-alert',
  group: 'dataDisplay',
  title: '警告提示',
  alias: 'alert',
  useBy: ['freePage'],
  properties: [
    {
      name: 'label',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '标题',
      setterComponentName: 'AInput'
    },
    {
      name: '_content',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '内容',
      setterComponentName: 'AInput'
    },
    {
      name: 'type',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          {
            label: '信息',
            value: 'info',
            __qe3V4ppRU6sAJYq0Yv: 'info'
          },
          { label: '成功', value: 'success', __qe3V4ppRU6sAJYq0Yv: 'success' },
          {
            label: '告警',
            value: 'warning',
            __qe3V4ppRU6sAJYq0Yv: 'warning'
          },
          { label: '错误', value: 'error', __qe3V4ppRU6sAJYq0Yv: 'error' },
          {
            label: '正常',
            value: 'normal',
            __qe3V4ppRU6sAJYq0Yv: 'normal'
          }
        ],
        allowClear: true,
        multiple: false
      },
      setterComponentVModelName: 'modelValue',
      title: '类型',
      setterComponentName: 'ASelect'
    },
    {
      name: 'transparent',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '背景透明',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'showIcon',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '展示图标',
      setterComponentName: 'ASwitch',
      setterDefaultValue: false
    },
    {
      name: 'closable',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '可关闭',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'center',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '内容居中',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'banner',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '去框去角',
      description: '是否作为顶部公告使用（去除边框和圆角）',
      setterComponentName: 'ASwitch'
    }
  ],
  actions: [{ name: 'click', title: '点击' }]
}
