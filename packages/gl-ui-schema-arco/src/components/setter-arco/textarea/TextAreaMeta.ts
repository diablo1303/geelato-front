export default {
  componentName: 'ATextarea',
  displayMode: 'tile',
  iconType: 'gl-textarea',
  group: 'dataEntry',
  title: '多行字符',
  alias: 'textarea',
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
      name: 'maxLength',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '输入值的最大长度',
      title: '最大长度',
      setterComponentName: 'AInputNumber'
    },
    {
      name: 'showWordLimit',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '字数统计',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'autoSize',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: '',
      description: '是否让文本框自适应内容高度',
      title: '适应高度',
      setterComponentName: 'ASwitch'
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
    },
    {
      name: 'disabled',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '禁用',
      setterComponentName: 'ASwitch'
    }
  ],
  actions: [{ name: 'valueChange', description: '', title: '值改变' }],
  displayOnStage: 'inline-block'
}