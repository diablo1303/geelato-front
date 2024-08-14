export default {
  componentName: 'ARate',
  displayMode: 'tile',
  iconType: 'gl-rate',
  group: 'dataEntry',
  title: '评分',
  alias: 'rate',
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
      name: 'count',
      setterComponentProps: { defaultValue: 5 },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      description: 'star 总数',
      title: '评分总数',
      setterComponentName: 'AInputNumber',
      show: true,
      expanded: true
    },
    {
      name: 'allowHalf',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      description: '是否允许半选',
      title: '半星评分',
      setterComponentName: 'ASwitch',
      show: true,
      expanded: true
    },
    {
      name: 'allowClear',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      title: '允许清除',
      description: '是否允许再次点击后清除',
      setterComponentName: 'ASwitch',
      show: true,
      expanded: true
    },
    {
      name: 'grading',
      setterComponentProps: { defaultValue: true },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      placeholder: '是否开启笑脸分级',
      title: '笑脸分级',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'disabled',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      description: '',
      title: '禁用',
      setterComponentName: 'ASwitch',
      show: true,
      expanded: true
    },
    {
      name: 'color',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentName: 'GlColorSetter',
      title: '颜色'
    },
    {
      name: 'character',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'slots',
      show: true,
      expanded: true,
      title: '符号',
      setterComponentName: 'AInput',
      slotComponentBindTarget: 'v-model'
    }
  ],
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
