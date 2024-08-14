export default {
  componentName: 'GlDict',
  displayMode: 'tile',
  iconType: 'gl-dict',
  group: 'dataEntry',
  title: '数据字典选择',
  alias: 'dict',
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
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '隐藏标题',
      setterComponentName: 'ASwitch',
      enableValueExpress: true
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
      name: 'dictId',
      setterComponentProps: {
        entityName: 'platform_dict',
        labelFieldNames: ['dictName'],
        valueFieldName: 'id',
        ascOrDesc: '+',
        orderFieldName: 'seqNo'
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '数据字典',
      description: '数据字典选项集',
      setterComponentName: 'GlDynamicSelect'
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
        '字典选择时，可同时将字典项的名称回填到另一个组件中，在此设置回填的目标组件唯一标识，也可以同时设置多个唯一标识，多个唯一标识之间用“,”分隔。',
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
        '字典选择时，可同时将字典项的值回填到另一个组件中，在此设置回填的目标组件唯一标识，也可以同时设置多个唯一标识，多个唯一标识之间用“,”分隔。',
      placeholder: '值回填组件唯一标识'
    },
    {
      name: 'dictAscOrDesc',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {
        type: 'button',
        options: [
          { label: '升序 asc', __FuNUUHKrAdsec1H3gt: '+', value: '+' },
          {
            label: '降序 desc',
            __FuNUUHKrAdsec1H3gt: '-',
            value: '-'
          }
        ],
        defaultValue: '+'
      },
      setterComponentVModelName: 'modelValue',
      title: '字典排序',
      setterComponentName: 'ARadioGroup',
      placeholder: '',
      description: '依据字典表的seqNo字段进行排序'
    },
    {
      name: 'displayType',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          { label: '下拉单选', value: 'select' },
          { label: '下拉复选', value: 'multiSelect' },
          { label: '展开单选', value: 'radio' },
          { label: '展开复选', value: 'checkbox' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '显示类型',
      setterComponentName: 'ARadioGroup',
      setterDefaultValue: 'select'
    },
    {
      name: 'dictItemDisplayMode',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {
        options: [
          { label: '编辑状态下隐藏禁用项', value: 'hideInEdit' },
          { label: '在各状态下展示禁用项', value: 'show' },
          { label: '在各状态下隐藏禁用项', value: 'hide' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '禁用项显示',
      setterComponentName: 'ASelect',
      setterDefaultValue: 'hideInEdit',
      description: '用于控制字典项中已禁用的项是否显示，默认为：在页面编辑状态下隐藏禁用项，在查看等其它状态下可见。'
    },
    {
      name: 'isForbiddenItemCanSelect',
      group: 'base',
      type: 'props',
      enableValueExpress: true,
      show: true,
      expanded: true,
      setterComponentProps: {
        checkedText:'禁用项可以选择',
        uncheckedText:'禁用项不可以选择'
      },
      setterComponentVModelName: 'modelValue',
      title: '禁用项可选',
      setterComponentName: 'ASwitch',
      description: '用于控制已禁用的字典项，是否可以选择（默认为false，即不可选择），对于表单建议按默认值，即不可选择，对于查询条件建议设置为true，即可以选择（因为可能存在一些历史数据需要查询）。注意该属性受“禁用项显示”属性影响，只有可见的才能控制是否可选。'
    },
    {
      name: 'showValueInLabel',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '显示值字段',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'showRemarkInLabel',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '显示描述字段',
      setterComponentName: 'ASwitch'
    },
    {
      name: 'size',
      setterComponentProps: {
        mode: 'SECRET_COMBOBOX_MODE_DO_NOT_USE',
        optionType: 'button',
        options: [
          { label: '大', value: 'large', __LlZ1Rnur2LSKVgPC2B: 'large' },
          {
            label: '默认',
            value: 'medium',
            __LlZ1Rnur2LSKVgPC2B: 'medium'
          },
          { label: '小', value: 'small', __LlZ1Rnur2LSKVgPC2B: 'small' },
          {
            label: '迷你',
            value: 'mini',
            __LlZ1Rnur2LSKVgPC2B: 'mini'
          }
        ],
        defaultValue: 'medium'
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
      name: 'allowClear',
      setterComponentProps: { defaultChecked: false },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      title: '点击清除',
      setterComponentName: 'ASwitch',
      show: true,
      expanded: true
    }
  ],
  actions: [
    { name: 'valueChange', description: '此时选项值不一定已加载完成', title: '值改变',params: [
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
      ] },
    { name: 'onOptionChange', description: '此时选项值已加载完成', title: '选项改变' }
  ],
  displayOnStage: 'inline-block'
}
