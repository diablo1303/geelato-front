export default {
  componentName: 'GlDynamicSelect',
  displayMode: 'tile',
  iconType: 'gl-select',
  group: 'dataEntry',
  title: '实体选择器',
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
      name: 'entityName',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '选项源实体',
      setterComponentName: 'GlEntitySelect'
    },
    {
      name: 'triggerMode',
      setterComponentProps: {
        options: [
          { label: '组件创建时', value: 'onCreated' },
          { label: '被调用时', value: 'onInvoked' },
          { label: '值改变时', value: 'onValueChanged' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '数据加载时机',
      setterComponentName: 'ARadioGroup',
      description: '不选择时，默认为组件创建时加载数据；“被调用时”，表示默认不加载数据，通过脚本来调用触发，如用于级联加载的场景。'
    },
    {
      title: '数据加载约束',
      name: 'triggerConstraint',
      setterComponentProps: {
        multiple:true,
        options: [
          { label: '组件值为空时不加载数据', value: 'DoNoFetchWhenEmpty' }
        ]
      },
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentName: 'ASelect',
      description: '满足任一种条件，则不触发加载数据。'
    },
    {
      name: 'labelFieldNames',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: { multiple: true },
      setterComponentVModelName: 'modelValue',
      description: '在下拉列表中显示的实体字段名',
      placeholder: '在下拉列表中显示的实体字段名',
      title: '显示字段',
      setterComponentName: 'GlFieldSelect',
      displayMode: 'tile'
    },
    {
      name: 'valueFiledName',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '值字段',
      description: '实体中，用于作为值的字段名',
      placeholder: '实体值字段名',
      setterComponentName: 'GlFieldSelect',
      setterDefaultValue:'id'
    },
    {
      name: 'orderFiledName',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '排序字段',
      setterComponentName: 'GlFieldSelect'
    },
    {
      name: 'ascOrDesc',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      displayMode: 'tile',
      setterComponentProps: {
        type: 'button',
        options: [
          {
            label: '升序（小到大）',
            value: '+',
          },
          { label: '降序（大到小）', value: '-'}
        ]
      },
      setterComponentVModelName: 'modelValue',
      title: '排序方向',
      setterComponentName: 'ARadioGroup'
    },
    {
      name: 'maxRecordCount',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      title: '最大记录',
      description: '加载的最大记录数，默认2000',
      placeholder: '最大记录数,默认2000',
      setterComponentName: 'AInputNumber'
    },
    {
      name: 'valueFilter',
      setterComponentProps: {},
      setterComponentVModelName: '',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      title: '数据过滤',
      _showSub: false,
      properties: [
        {
          name: 'name',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          setterComponentName: 'GlFieldSelect',
          title: '字段名'
        },
        {
          name: 'cop',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {
            options: [
              {
                label: '等于',
                value: 'eq',
                __sfh6bOn4TZO1ya3MA3: 'eq'
              },
              { label: '不等于', value: 'neq', __sfh6bOn4TZO1ya3MA3: 'neq' },
              {
                label: '小于',
                value: 'lt',
                __sfh6bOn4TZO1ya3MA3: 'lt'
              },
              { label: '小于等于', value: 'lte', __sfh6bOn4TZO1ya3MA3: 'lte' },
              {
                label: '大于',
                value: 'gt',
                __sfh6bOn4TZO1ya3MA3: 'gt'
              },
              { label: '大于等于', value: 'gte', __sfh6bOn4TZO1ya3MA3: 'gte' },
              {
                label: '开头包括',
                value: 'sw',
                __sfh6bOn4TZO1ya3MA3: 'sw'
              },
              { label: '结尾包括', value: 'ew', __sfh6bOn4TZO1ya3MA3: 'ew' },
              {
                label: '包括',
                value: 'contains',
                __sfh6bOn4TZO1ya3MA3: 'contains'
              },
              { label: '在数组或字符串(s1,s2)范围(in)', value: 'in' },
              { label: '不在数组或字符串(s1,s2)范围', value: 'nin' },
              { label: '在...两值之间(between)', value: 'bt' },
              { label: '是否空', value: 'nil' }
            ]
          },
          setterComponentVModelName: 'modelValue',
          title: '比较',
          setterComponentName: 'ASelect'
        },
        {
          name: 'valueExpression',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {
            showInput:true
          },
          setterComponentVModelName: 'modelValue',
          title: '字段值',
          setterComponentName: 'GlExpressionSetter',
          placeholder: ''
        }
      ],
      setterComponentName: 'GlObjectArraySetter',
      titleField: 'name',
      subTitleField: '',
      alarmIfNoSubTitle: ''
    },
    {
      name: 'extraFieldAndBindIds',
      group: 'base',
      type: 'props',
      enableValueExpress: false,
      show: true,
      expanded: true,
      setterComponentProps: {},
      setterComponentVModelName: '',
      title: '数据联动',
      description: '获取更多的字段信息，并设置到指定的组件中',
      _showSub: false,
      properties: [
        {
          name: 'fieldName',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          title: '字段名',
          placeholder: '',
          setterComponentName: 'GlFieldSelect'
        },
        {
          name: 'bindId',
          group: 'base',
          type: 'props',
          enableValueExpress: false,
          show: true,
          expanded: true,
          setterComponentProps: {},
          setterComponentVModelName: 'modelValue',
          setterComponentName: 'AInput',
          title: '绑定组件'
        }
      ],
      setterComponentName: 'GlObjectArraySetter',
      titleField: 'fieldName',
      alarmIfNoSubTitle: '未设置',
      subTitleField: ''
    },
    {
      name: 'multiple',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      title: '多选',
      setterComponentName: 'ASwitch',
      show: true,
      expanded: true,
      enableValueExpress: true
    },
    {
      name: 'size',
      setterComponentProps: {
        mode: 'SECRET_COMBOBOX_MODE_DO_NOT_USE',
        optionType: 'button',
        options: [
          { label: '大', value: 'large', __TjjKdG3HMXO3v7kSND: 'large' },
          {
            label: '默认',
            value: 'default',
            __TjjKdG3HMXO3v7kSND: 'default'
          },
          { label: '小', value: 'small', __TjjKdG3HMXO3v7kSND: 'small' }
        ],
        defaultValue: 'default'
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
      name: 'allowSearch',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '允许搜索',
      setterComponentName: 'ASwitch',
      enableValueExpress: false
    },
    {
      name: 'ignoreSearchWords',
      setterComponentProps: {},
      setterComponentVModelName: 'modelValue',
      group: 'base',
      type: 'props',
      show: true,
      expanded: true,
      title: '不可搜索的词',
      setterComponentName: 'ATextarea',
      enableValueExpress: true,
      description: '不可搜索的词，多个用英文逗号分隔，如："广,州,深,圳,市,有,限,公,司,东,上,海"'
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
      expanded: true,
      enableValueExpress: false
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
      description: '基于表达式计算默认值'
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
      placeholder: '如：6% 或 100px'
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
      enableValueExpress: true
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
      enableValueExpress: true
    }
  ],
  actions: [{ name: 'onValueChange', description: '', title: '值改变' }],
  displayOnStage: 'inline-block',
  methods: [{ name: 'fetchData', title: '获取数据' }]
}
