export default {
  componentName: 'ADatePicker',
  displayMode: 'tile',
  iconType: 'gl-datePicker',
  group: 'dataEntry',
  title: '日期选择',
  alias: 'date',
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
      name: 'showTime',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '显示时间',
      placeholder: '日期是否带明细时间',
      setterComponentName: 'ASwitch',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'format',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'AInput',
      setterDefaultValue: 'YYYY-MM-DD HH:mm',
      placeholder: 'YYYY-MM-DD HH:mm',
      description: '日期格式：YYYY-MM-DD，日期时间格式：YYYY-MM-DD HH:mm',
      title: '展示格式'
    },
    {
      name: 'allowClear',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '允许清除',
      placeholder: '是否允许清除',
      setterComponentName: 'ASwitch',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: 'size',
      setterComponentProps: {
        options: [
          {
            label: '迷你',
            value: 'mini',
            __GlaD5HhxKiiLtDLRn4: 'mini'
          },
          { label: '小', value: 'small', __GlaD5HhxKiiLtDLRn4: 'small' },
          {
            label: '中',
            value: 'medium',
            __GlaD5HhxKiiLtDLRn4: 'medium'
          },
          { label: '大', value: 'large', __GlaD5HhxKiiLtDLRn4: 'large' }
        ],
        type: 'radio'
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      placeholder: '日期选择器的尺寸',
      title: '尺寸',
      setterComponentName: 'ARadioGroup',
      enableValueExpress: false,
      displayMode: 'tile'
    },
    {
      name: '_valueExpression',
      setterComponentProps: { showInput: true },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '默认值',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      description: '基于表达式计算默认值',
      displayMode: 'tile'
    },
    {
      name: '_labelColFlex',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '标题宽度',
      setterComponentName: 'AInput',
      description: '标题的宽度，默认的标题占比20%（精确值应为20.83%，这里需填整数去掉.83）',
      placeholder: '如：6% 或 100px',
      displayMode: 'tile'
    },
    {
      name: 'placeholder',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '占位提示',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      displayMode: 'tile'
    },
    {
      name: 'description',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '描述',
      setterComponentName: 'AInput',
      enableValueExpress: true,
      displayMode: 'tile'
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
