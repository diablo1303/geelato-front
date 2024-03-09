export default {
  componentName: 'GlImage',
  displayMode: 'tile',
  iconType: 'gl-image',
  group: 'dataEntry',
  title: '图片',
  alias: 'image',
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
      name: 'srcType',
      setterComponentProps: {
        type: 'button',
        options: [
          { label: 'ID', value: 'ID' },
          {
            label: 'Base64',
            value: 'Base64'
          }
        ],
        defaultValue: 'ID'
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '图片保存格式',
      setterComponentName: 'ARadioGroup',
      description: '绝大部分的场景保存为ID格式，即数据库中存为ID字段，图片存到文件系统；只有图片较小的情况，如站点的logo，可以存为base64在页面加载时直接展示，不用再通过ID请求服务端加载图片，但会占用更多数据库读写资源等问题。'
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
      name: 'width',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      description: '图片显示宽度，单位为px',
      title: '宽度',
      setterComponentName: 'AInputNumber',
      placeholder: '如28，表示28px'
    },
    {
      name: 'height',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '图片显示高度，单位为px',
      title: '高度',
      setterComponentName: 'AInputNumber',
      placeholder: '如28，表示28px'
    },
    {
      name: 'description',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '描述，将显示在底部，如果 alt 没有值，则会将其设置给 alt',
      title: '底部描述',
      setterComponentName: 'AInput'
    },
    {
      name: 'fit',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          {
            label: 'contain',
            value: 'contain',
          },
          { label: 'cover', value: 'cover'},
          {
            label: 'fill',
            value: 'fill',
          },
          { label: 'none', value: 'none'},
          {
            label: 'scale-down',
            value: 'scale-down',
          }
        ],
        allowClear: true
      },
      setterComponentVModelName: 'modelValue',
      description: '确定图片如何适应容器框',
      setterComponentName: 'ASelect',
      title: '适应容器'
    },
    {
      name: 'alt',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '图片的文字描述',
      title: 'alt描述',
      setterComponentName: 'AInput'
    }
  ],
  actions: []
}
