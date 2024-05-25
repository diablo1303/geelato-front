export default {
  componentName: 'GlDescriptions',
  displayMode: 'tile',
  iconType: 'gl-description',
  group: 'dataDisplay',
  title: '描述列表',
  alias: 'desc',
  useBy: ['freePage'],
  properties: [
    {
      expanded: true,
      name: 'label',
      title: '标题',
      group: 'base',
      placeholder: '',
      description: '标题',
      setterComponentName: 'AInput',
      setterComponentVModelName: 'modelValue',
      setterComponentProps: {},
      type: 'props',
      show: true,
      enableValueExpress: true
    },
    {
      expanded: true,
      name: 'column',
      title: '每行列数',
      group: 'base',
      placeholder: '',
      setterComponentName: 'AInput',
      setterComponentVModelName: 'modelValue',
      setterComponentProps: {},
      type: 'props',
      show: true,
      enableValueExpress: true,
      description: '每行放置的数据个数'
    },
    {
      name: 'layout',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          { label: '水平排列', value: 'horizontal' },
          { label: '垂直排列', value: 'vertical' },
          { label: '行内水平排列', value: 'inline-horizontal' },
          { label: '行内垂直排列', value: 'inline-vertical' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '排列方式',
      setterComponentName: 'ASelect'
    },
    {
      name: 'tableLayout',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          { label: '自动宽度', value: 'auto' },
          { label: '平均宽度', value: 'fixed' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '分布宽度',
      setterComponentName: 'ARadioGroup'
    },
    {
      name: 'align',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        type: 'button',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '右对齐', value: 'right' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '文字对齐',
      setterComponentName: 'ARadioGroup'
    },
    {
      name: 'size',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        type: 'button',
        options: [
          { label: '迷你', value: 'mini' },
          { label: '小的', value: 'small' },
          { label: '一般', value: 'medium' },
          { label: '大的', value: 'large' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '列表大小',
      setterComponentName: 'ARadioGroup',
      setterDefaultValue: 'small'
    },
    {
      expanded: true,
      name: 'bordered',
      title: '显示边框',
      group: 'base',
      placeholder: '',
      setterComponentName: 'ASwitch',
      setterComponentVModelName: 'modelValue',
      setterComponentProps: {},
      type: 'props',
      show: true,
      enableValueExpress: true,
      description: ''
    },
    {
      name: 'items',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: '',
      _showSub: false,
      properties: [
        {
          name: 'label',
          setterComponentProps: { allowClear: true },
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '字段标题',
          setterComponentName: 'AInput',
          enableValueExpress: false,
          displayMode: 'tile',
          placeholder: '如，时间文本'
        },
        {
          name: 'content',
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          show: true,
          expanded: true,
          title: '字段内容',
          setterComponentName: 'AInput',
          enableValueExpress: false,
          displayMode: 'tile',
          description: '节点的唯一编码字段，可用作动态节点数据更新静态节点数据的依据'
        },

        {
          name: 'span',
          setterComponentProps: {precision:0},
          setterComponentVModelName: 'modelValue',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          displayMode: 'tile',
          title: '所占列数',
          setterComponentName: 'AInputNumber',
          description: '所占列数，默认为1，总列数见属性每行列数（默认为3）。'
        }
      ],
      setterComponentName: 'GlObjectArraySetter',
      titleField: 'label',
      alarmIfNoSubTitle: '无标题',
      title: '列表项',
      description: '若配置了静态节点，则动态节点无效'
    }
  ],
  actions: []
}
