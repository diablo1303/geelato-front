export default {
  componentName: 'ACheckboxGroup',
  displayMode: 'tile',
  iconType: 'gl-checkbox',
  group: 'dataEntry',
  title: '多选框',
  alias: 'cb',
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
      enableValueExpress: false
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
      name: 'options',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '选项',
      setterComponentName: 'GlOptionsSetter',
      enableValueExpress: false
    },
    {
      name: 'max',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      placeholder: '',
      description: '',
      title: '最大选中数',
      setterComponentName: 'AInputNumber'
    },
    {
      name: 'direction',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {
        type: 'radio',
        options: [
          {
            label: '水平',
            v_y2YdErykBVuNFkV7: 'horizontal',
            value: 'horizontal',
            __mSHfV0pcIA2Fpt8EAX: 'horizontal'
          },
          {
            label: '垂直',
            v_y2YdErykBVuNFkV7: 'vertical',
            value: 'vertical',
            __mSHfV0pcIA2Fpt8EAX: 'vertical'
          }
        ],
        defaultValue: 'horizontal'
      },
      setterComponentVModelName: 'modelValue',
      title: '方向',
      setterComponentName: 'ARadioGroup',
      enableValueExpress: false
    },
    {
      name: 'disabled',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '禁用',
      setterComponentName: 'ASwitch'
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
