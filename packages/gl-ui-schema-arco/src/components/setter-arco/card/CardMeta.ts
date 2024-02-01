export default {
  componentName: 'GlCard',
  displayMode: 'tile',
  iconType: 'gl-card',
  group: 'layout',
  title: '卡片',
  alias: 'card',
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
      name: 'showLabel',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '是否显示标题',
      title: '显示标题',
      setterComponentName: 'ASwitch',
      setterDefaultValue: true
    },
    {
      name: 'bordered',
      setterComponentProps: { defaultValue: true },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '带边框',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'hoverable',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '悬浮样式',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'size',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        type: 'button',
        defaultValue: 'medium',
        options: [
          { label: '一般', v_L0IeSNWMqjSZkU4L: 'medium', value: 'medium' },
          {
            label: '小',
            v_L0IeSNWMqjSZkU4L: 'small',
            value: 'small'
          }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '大小',
      setterComponentName: 'ARadioGroup',
      setterDefaultValue: 'small'
    },
    {
      name: 'extra',
      group: 'base',
      type: 'slots',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '右上操作',
      setterComponentName: 'GlSlotSetter',
      slotComponentName: 'GlComponent',
      slotComponentBindTarget: 'v-model',
      slotComponentBindName: 'glComponentInst'
    },
    {
      name: 'actions',
      group: 'base',
      type: 'slots',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '底部操作',
      setterComponentName: 'GlSlotSetter',
      slotComponentName: 'GlComponent',
      slotComponentBindTarget: 'v-model',
      slotComponentBindName: 'glComponentInst'
    },
    {
      name: 'cover',
      group: 'base',
      type: 'slots',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '封面插槽',
      setterComponentName: 'GlSlotSetter',
      slotComponentName: 'GlComponent',
      slotComponentBindTarget: 'v-model',
      slotComponentBindName: 'glComponentInst'
    }
  ],
  actions: []
}
