export default {
  componentName: 'AInputNumber',
  displayMode: 'tile',
  iconType: 'gl-inputNumber',
  group: 'dataEntry',
  title: '数字输入',
  alias: 'number',
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
      name: 'mode',
      setterComponentProps: {
        options: [
          {
            label: '按钮内嵌',
            value: 'embed',
            __S2VY4cybNxkOrSfN4C: 'embed'
          },
          { label: '左右按钮', value: 'button', __S2VY4cybNxkOrSfN4C: 'button' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '模式',
      description: '（embed：按钮内嵌模式，button：左右按钮模式）',
      setterComponentName: 'ARadioGroup',
      enableValueExpress: false
    },
    {
      name: 'precision',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      title: '数值精度',
      setterComponentName: 'AInputNumber',
      show: true,
      expanded: true,
      enableValueExpress: false
    },
    {
      name: 'step',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      description: '每次改变步数，可以为小数',
      title: '步数',
      setterComponentName: 'AInputNumber',
      show: true,
      expanded: true,
      enableValueExpress: false
    },
    {
      name: 'max',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      title: '最大值',
      setterComponentName: 'AInputNumber',
      show: true,
      expanded: true,
      enableValueExpress: false
    },
    {
      name: 'min',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      title: '最小值',
      setterComponentName: 'AInputNumber',
      show: true,
      expanded: true,
      enableValueExpress: false
    },
    {
      name: 'size',
      setterComponentProps: {
        optionType: 'button',
        buttonStyle: 'solid',
        options: [
          {
            label: '迷你',
            value: 'mini',
            v_Q3KYsgxp5al9vtx3: 'mini',
            __9gVrjp624mDjD95IHQ: 'mini'
          },
          {
            label: '小',
            value: 'small',
            v_Q3KYsgxp5al9vtx3: 'small',
            __9gVrjp624mDjD95IHQ: 'small'
          },
          {
            label: '中',
            value: 'medium',
            v_Q3KYsgxp5al9vtx3: 'medium',
            __9gVrjp624mDjD95IHQ: 'medium'
          },
          {
            label: '大',
            value: 'large',
            v_Q3KYsgxp5al9vtx3: 'large',
            __9gVrjp624mDjD95IHQ: 'large'
          }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      title: '大小',
      setterComponentName: 'ARadioGroup',
      show: true,
      expanded: true,
      enableValueExpress: false
    },
    {
      name: 'suffix',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'slots',
      show: true,
      expanded: true,
      title: '后置标签',
      setterComponentName: 'AInput',
      slotComponentName: 'GlText',
      slotComponentBindTarget: 'v-model',
      enableValueExpress: true
    },
    {
      name: 'prefix',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'slots',
      show: true,
      expanded: true,
      title: '前置标签',
      setterComponentName: 'AInput',
      slotComponentName: 'GlText',
      slotComponentBindTarget: 'v-model',
      enableValueExpress: true
    },
    {
      name: 'allowClear',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      placeholder: '是否允许清空输入框',
      title: '允许清空',
      setterComponentName: 'ASwitch',
      enableValueExpress: false
    },
    {
      name: 'hideButton',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      title: '隐藏按钮',
      setterComponentName: 'ASwitch',
      show: true,
      expanded: true,
      enableValueExpress: true
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
