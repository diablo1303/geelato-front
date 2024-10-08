export default {
  componentName: 'ASelect',
  displayMode: 'tile',
  iconType: 'gl-select',
  group: 'dataEntry',
  title: '自定义选择',
  alias: 'select',
  useBy: ['freePage'],
  deprecated: true,
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
      setterComponentName: 'AInput'
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
      setterComponentName: 'GlEntityFieldSelect'
    },
    {
      name: 'options',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: { multiple: false, allowClear: false, options: [] },
      setterComponentVModelName: 'modelValue',
      title: '自定义选项',
      setterComponentName: 'GlOptionsSetter'
    },
    {
      name: 'size',
      setterComponentProps: {
        mode: 'SECRET_COMBOBOX_MODE_DO_NOT_USE',
        optionType: 'button',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          {
            label: '小',
            value: 'small'
          }
        ],
        defaultValue: 'default'
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      title: '大小',
      setterComponentName: 'ARadioGroup',
      show: true,
      expanded: true
    },
    {
      name: 'multiple',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '是否开启多选模式（多选模式默认开启搜索）',
      title: '开启多选',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'allowSearch',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '允许搜索',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'allowClear',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      title: '点击清除',
      setterComponentName: 'ASwitch',
      show: true,
      expanded: true
    },
    {
      name: 'placeholder',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '提示文字',
      setterComponentName: 'AInput'
    }
  ],
  actions: [{ name: 'valueChange', description: '', title: '值改变',params: [
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
    ] }],
  displayOnStage: 'inline-block'
}
