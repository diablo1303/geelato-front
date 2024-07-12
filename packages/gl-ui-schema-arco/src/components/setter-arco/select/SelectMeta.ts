export default {
  componentName: 'GlSelect',
  displayMode: 'tile',
  iconType: 'gl-select',
  group: 'dataEntry',
  title: '自定义选择',
  alias: 'select',
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
      setterComponentName: 'GlOptionsSetter',
      enableValueExpress: true
    },
    {
      name: 'nameFieldBindComponentId',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '名回填组件',
      setterComponentName: 'AInput',
      description:
        '选择时，可同时将选项的名称回填到另一个组件中，在此设置回填的目标组件唯一标识，也可以同时设置多个唯一标识，多个唯一标识之间用“,”分隔。',
      placeholder: '名称回填组件唯一标识'
    },
    {
      name: 'valueFieldBindComponentId',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '值回填组件',
      setterComponentName: 'AInput',
      description:
        '选择时，可同时将选项的值回填到另一个组件中，在此设置回填的目标组件唯一标识，也可以同时设置多个唯一标识，多个唯一标识之间用“,”分隔。',
      placeholder: '值回填组件唯一标识'
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
  actions: [{ name: 'onValueChange', description: '', title: '值改变' }],
  displayOnStage: 'inline-block'
}
