export default {
  componentName: 'GlPageTemplateFlow',
  displayMode: 'tile',
  iconType: 'gl-flow',
  group: 'pageTemplate',
  title: '流程页面模板',
  alias: 'page',
  useBy: ['freePage'],
  properties: [
    {
      name: 'layoutMode',
      setterComponentProps: {
        options: [
          { label: '选项卡', value: 'tabs', __9ikhAvcgP1svC58GnP: 'tabs' },
          { label: '折叠', value: 'collapse', __9ikhAvcgP1svC58GnP: 'collapse' }
        ],
        multiple: false,
        type: 'button'
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '布局模式',
      setterComponentName: 'ARadioGroup',
      enableValueExpress: false,
      displayMode: 'tile',
      setterDefaultValue: 'tabs'
    },
    {
      name: 'tabsPosition',
      setterComponentProps: {
        readonly: false,
        options: [
          { label: '上', value: 'top', __IJPAbQnRnPBCLnBYJq: 'top' },
          { label: '下', value: 'bottom', __IJPAbQnRnPBCLnBYJq: 'bottom' },
          { label: '左', value: 'left', __IJPAbQnRnPBCLnBYJq: 'left' },
          { label: '右', value: 'right', __IJPAbQnRnPBCLnBYJq: 'right' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '选项卡位置',
      description: '只在布局模式为选项卡时有效',
      setterComponentName: 'ASelect',
      displayMode: 'tile',
      setterDefaultValue: 'top'
    },
    {
      name: 'enabledStatusImage',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: { checkedText: '启用', uncheckedText: '不启用' },
      setterComponentVModelName: 'modelValue',
      title: '启用状态图片',
      setterComponentName: 'ASwitch',
      placeholder: '',
      enableValueExpress: false,
      displayMode: 'tile',
      description: '是否启用印章状态图片',
      setterDefaultValue: true
    }
  ],
  actions: [],
  methods: []
}