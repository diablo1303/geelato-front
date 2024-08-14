export default {
  componentName: 'ASwitch',
  displayMode: 'tile',
  iconType: 'gl-switch',
  group: 'dataEntry',
  title: '开关',
  alias: 'switch',
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
      name: 'checkedValue',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      title: '选中时值',
      setterComponentName: 'AInputNumber',
      setterDefaultValue: 1
    },
    {
      name: 'uncheckedValue',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '未选时值',
      setterComponentName: 'AInputNumber',
      setterDefaultValue: 0
    },
    {
      name: 'checkedText',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: "打开状态时的文案（type='line'和size='small'时不生效）",
      title: '选中时文字',
      setterComponentName: 'AInput'
    },
    {
      name: 'uncheckedText',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '未选时文字',
      setterComponentName: 'AInput',
      description: "关闭状态时的文案（type='line'和size='small'时不生效）"
    },
    {
      name: 'checkedColor',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '选中时颜色',
      description: '选中时的开关颜色',
      setterComponentName: 'GlColor'
    },
    {
      name: 'uncheckedColor',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '未选中时的开关颜色',
      title: '未选时颜色',
      setterComponentName: 'GlColor'
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
    ] }]
}
