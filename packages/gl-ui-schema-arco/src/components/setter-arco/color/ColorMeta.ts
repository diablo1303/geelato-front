export default {
  componentName: 'GlColor',
  displayMode: 'tile',
  iconType: 'gl-color',
  group: 'dataEntry',
  title: '颜色',
  alias: 'color',
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
      name: 'format',
      setterComponentProps: {
        options: [
          { label: 'hex', value: 'hex' },
          { label: 'rgb', value: 'rgb' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '颜色值格式',
      setterComponentName: 'ARadioGroup'
    },
    {
      name: 'size',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        options: [
          { label: 'mini', value: 'mini' },
          { label: 'small', value: 'small' },
          { label: 'medium', value: 'medium' },
          { label: 'large', value: 'large' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      description: '',
      title: '尺寸',
      setterComponentName: 'ASelect'
    },
    {
      name: 'showText',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {defaultChecked: true},
      setterDefaultValue: true,
      setterComponentVModelName: 'modelValue',
      title: '显示颜色值',
      setterComponentName: 'ASwitch',
      description:''
    },
    {
      name: 'showPreset',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {defaultChecked: true},
      setterDefaultValue: true,
      setterComponentVModelName: 'modelValue',
      title: '显示预设颜色',
      setterComponentName: 'ASwitch',
      description:''
    },
    {
      name: 'showHistory',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '显示历史颜色',
      setterComponentName: 'ASwitch',
      description:''
    },
    {
      name: 'disabledAlpha',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '禁用透明',
      setterComponentName: 'ASwitch',
      description:'禁用透明通道'
    },
    {
      name: 'hideTrigger',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '只显示色板',
      setterComponentName: 'ASwitch',
      description:'没有触发元素，只显示颜色面板'
    },
    {
      name: 'presetColors',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '预设颜色数组',
      setterComponentName: 'GlArrayColorSetter',
      description:'预设颜色的颜色数组'
    },
  ],
  displayOnStage: 'inline-block',
  actions: [{ name: 'valueChange', description: '', title: '值改变' ,params: [
      {
        name: 'value',
        title: '修改后的值',
        required: true,
        type: 'any',
        description: '修改后的值。'
      },
      {
        name: 'oldValue',
        title: '修改前的值',
        required: true,
        type: 'any',
        description: '修改前的值，如是值是对象引用，修改后和修改前的是同一个，值相同。'
      }
    ]}]
}
