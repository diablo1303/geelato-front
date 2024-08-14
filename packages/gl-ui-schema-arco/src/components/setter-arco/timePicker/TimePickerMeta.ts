export default {
  componentName: 'ATimePicker',
  displayMode: 'tile',
  iconType: 'gl-timePicker',
  group: 'dataEntry',
  title: '时间选择',
  alias: 'time',
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
      name: 'type',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {
        type: 'button',
        options: [
          { label: '时间点', value: 'time', __fA0SBAzXEyqbuesdwc: 'time' },
          {
            label: '时间段',
            value: 'time-range',
            __fA0SBAzXEyqbuesdwc: 'time-range'
          }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '类型',
      setterComponentName: 'ARadioGroup'
    },
    {
      name: 'format',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '格式',
      setterDefaultValue: '',
      description: '',
      placeholder: 'HH:mm:ss',
      setterComponentName: 'AInput'
    },
    {
      name: 'allowClear',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      setterComponentName: 'ASwitch',
      title: '允许清除'
    },
    {
      name: 'disabledHours',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '禁用的部分小时选项',
      title: '禁用小时',
      setterComponentName: 'GlArrayNumberSetter'
    },
    {
      name: 'disabledMinutes',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '禁用的部分分钟选项',
      title: '禁用分钟',
      setterComponentName: 'GlArrayNumberSetter'
    },
    {
      name: 'disabledSeconds',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      description: '禁用的部分秒数选项',
      title: '禁用秒数',
      setterComponentName: 'GlArrayNumberSetter'
    },
    {
      name: 'size',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          {
            label: 'mini',
            __bsyVOtmqWWIi8BXTUF: 'mini',
            value: 'mini'
          },
          { label: 'small', __bsyVOtmqWWIi8BXTUF: 'small', value: 'small' },
          {
            label: 'medium',
            __bsyVOtmqWWIi8BXTUF: 'medium',
            value: 'medium'
          },
          { label: 'large', __bsyVOtmqWWIi8BXTUF: 'large', value: 'large' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      description: '输入框尺寸',
      title: '尺寸',
      setterComponentName: 'ASelect'
    },
    {
      name: 'use12Hours',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '12 小时制',
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
    ] }],
}
